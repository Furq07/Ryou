const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const ms = require("ms");
const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "mute",
  description: "This Command Mutes Member in Server!",
  userPermissions: [PermissionsBitField.Flags.MuteMembers],
  options: [
    {
      name: "member",
      description: "Who you wanna Mute?",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "time",
      description: "For How Much time the Member will be Muted?",
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "5 Minutes", value: "5 minutes" },
        { name: "10 Minutes", value: "10 minutes" },
        { name: "30 Minutes", value: "30 minutes" },
        { name: "1 Hour", value: "1 hour" },
        { name: "3 Hours", value: "3 hours" },
        { name: "5 Hours", value: "5 hours" },
        { name: "8 Hours", value: "8 hours" },
        { name: "10 Hours", value: "10 hours" },
        { name: "15 Hours", value: "15 hours" },
        { name: "20 Hours", value: "20 hours" },
        { name: "1 Day", value: "1 day" },
        { name: "2 Days", value: "2 days" },
        { name: "3 Days", value: "3 days" },
        { name: "4 Days", value: "4 days" },
        { name: "5 Days", value: "5 days" },
        { name: "6 Days", value: "6 days" },
        { name: "1 Week", value: "1 week" },
      ],
      required: true,
    },
    {
      name: "reason",
      description: "What is the Reason for Muting the Member?",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async execute(interaction, client) {
    const { options, member, guild } = interaction;
    const target = options.getMember("member");
    const reason = options.getString("reason");
    const time = options.getString("time");
    const timeInMs = ms(time);
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
      .setDescription(`You can't Mute someone who have Higher Rank than You.`)
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
      .setDescription(`You Have Been Muted in **${guild.name}**`)
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      })
      .setFields(
        {
          name: `**Moderator:**`,
          value: `${interaction.member}`,
          inline: true,
        },
        { name: `**Reason:**`, value: `${reason}`, inline: true },
        { name: `**Time:**`, value: ` ${time}`, inline: true }
      )
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      });
    // CHANNEL MESSAGE
    const ReplyEmbed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle("User Muted!")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(`${target.user} is now Muted!`)
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      })
      .setFields(
        {
          name: `**Moderator:**`,
          value: `${interaction.member}`,
          inline: true,
        },
        { name: `**Reason:**`, value: `${reason}`, inline: true },
        { name: `**Time:**`, value: ` ${time}`, inline: true }
      )
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      });

    target.timeout(timeInMs, reason);
    target.send({ embeds: [DmUserEmbed] });
    interaction.reply({ embeds: [ReplyEmbed] });
  },
};
