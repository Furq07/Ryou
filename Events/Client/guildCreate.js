const { EmbedBuilder, ChannelType, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "guildCreate",
  execute(guild, client) {
    const { user } = client;
    const channelToSend =
      guild.systemChannel ||
      guild.channels.cache.find(
        (channel) => channel.type == ChannelType.GuildText
      );
    const embed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle("Thank You for Adding Me!")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(
        `
    Hi I'm **Ryou**.
    I'm at your server to manage it.
      
    To start off, you must set me up.
    Use the command </setup:1056172939885682699> for that!
    `
      )
      .setFooter({
        iconURL: user.displayAvatarURL({ dynamic: true }),
        text: "Ryou",
      });
    if (!channelToSend) {
      guild
        .fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 1 })
        .then((log) => log.entries.first().executor.send({ embeds: [embed] }));
      return;
    }
    channelToSend.send({ embeds: [embed] });
    new setupDB({ GuildID: guild.id }).save();
  },
};
