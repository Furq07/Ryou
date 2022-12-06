const {
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "guildBanRemove",
  async execute(ban, client) {
    let setupData = await setupDB.findOne({ GuildID: ban.guild.id });
    if (!setupData) return;
    if (!setupData.logChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.logChannelID}`);
    logChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#800000")
          .setDescription(`A user was Unbanned`)
          .addFields(
            {
              name: "User:",
              value: `<@${ban.user.id}>`,
              inline: true,
            },
            {
              name: "ID:",
              value: `${ban.user.id}`,
              inline: true,
            }
          )
          .setFooter({
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
            text: "Ryou - Logs",
          })
          .setAuthor({
            name: "User Unban",
            iconURL: `${ban.guild.iconURL({ dynamic: true })}`,
          })
          .setTimestamp(),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("send-invite-button")
            .setLabel("Send Invite")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
  },
};
