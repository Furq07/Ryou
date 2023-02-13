const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "unmute",
  description: "This Command Unmutes Member from Server!",
  userPermissions: [PermissionsBitField.Flags.MuteMembers],
  options: [
    {
      name: "member",
      description: "Who you wanna Unmute?",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  async execute(interaction, client) {
    const { guild, options, member } = interaction;
    const target = options.getMember("member");
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

    const errEmbed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle("Whoopsi")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(`You can't Unmute someone who have Higher Rank than You.`)
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      });

    if (target.roles.highest.position >= member.roles.highest.position)
      return interaction.reply({
        embeds: [errEmbed],
      });

    // DM MESSAGE
    const DmUserEmbed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle(`${target.user.tag}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(`You Have Been Unmuted in **${guild.name}**`)
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      });
    // CHANNEL MESSAGE
    const ReplyEmbed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle("User Unmuted!")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(`${target.user} is Unmuted!`)
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      });
    target.timeout(null);
    target.send({ embeds: [DmUserEmbed] });
    interaction.reply({ embeds: [ReplyEmbed] });
  },
};
