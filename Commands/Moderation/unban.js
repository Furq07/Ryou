const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "unban",
  description: "This Command Unbans Member from Server!",
  userPermissions: [PermissionsBitField.Flags.BanMembers],
  options: [
    {
      name: "userid",
      description: "Enter the user id of the User you wanna unban",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async execute(interaction, client) {
    const { options, guild } = interaction;
    const userId = options.getString("userid");
    const target = guild.members.cache.get(userId);
    let setupData = setupDB.findOne({ GuildID: guild.id });

    if (
      target.roles.cache.find((r) => r.id == setupData.staffRoleID) ||
      target.permissions.has(PermissionsBitField.Flags.Administrator)
    )
      return interaction.reply({
        embeds: [
          embed.setDescription(
            "The User you are Trying to Perform Action on is an Staff Member!"
          ),
        ],
        ephemeral: true,
      });

    guild.members
      .unban(userId)
      .then((user) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setTitle(`User is Unbanned!`)
              .setDescription(`${user.tag} is Unbanned from this Server!`)
              .setThumbnail(guild.iconURL({ dynamic: true }))
              .setFooter({
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                text: "Ryou",
              }),
          ],
        });
      })
      .catch(() => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setTitle(`Whoopsi`)
              .setDescription(`Please Specify a Valid Banned Member's ID!`)
              .setThumbnail(guild.iconURL({ dynamic: true }))
              .setFooter({
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                text: "Ryou - Moderation",
              }),
          ],
        });
      });
  },
};
