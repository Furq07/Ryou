const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "kick",
  description: "This Command Kicks Member from Server!",
  userPermissions: [PermissionsBitField.Flags.KickMembers],
  options: [
    {
      name: "member",
      description: "Who you wanna Kick?",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "What is the Reason for Kicking the Member?",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async execute(interaction, client) {
    const { options, guild, member } = interaction;
    const target = options.getMember("member");
    const reason = options.getString("reason");
    let setupData = setupDB.findOne({ GuildID: guild.id });

    if (
      target.roles.cache.find((r) => r.id === setupData.staffRoleID) ||
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
      .setDescription(`You can't Kick someone who have Higher Rank than You.`)
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      });

    if (target.roles.highest.position >= member.roles.highest.position)
      return interaction.reply({
        embeds: [errEmbed],
      });

    const embed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle(`You are Kicked!!`)
      .setDescription(`You Have Been Kicked from ${guild.name}`)
      .setFields({ name: "Reason:", value: reason });

    try {
      await target.send({ embeds: [embed] });
    } catch {
      interaction.reply({
        content: `${target} Have set DMS to Friend Only, I can't send him the Message, But ${target.user.username} is Kicked!`,
        ephemeral: true,
      });
    }

    target.kick(reason);

    const embed2 = new EmbedBuilder()
      .setColor("#800000")
      .setTitle(`${target.user.username} is Kicked!`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(`${target.user.tag} is Kicked from this Server!`)
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      });

    interaction.reply({ embeds: [embed2] });
  },
};
