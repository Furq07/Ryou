const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../../src/models/setupDB");
module.exports = {
  name: "channelCreate",
  async execute(channel, client) {
    const { guild } = channel;
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    if (
      !setupData ||
      !setupData.LogChannelID ||
      !setupData.LogChannelCreateSetup ||
      setupData.LogChannelCreateSetup === false
    )
      return;
    const logChannel = guild.channels.cache.get(setupData.LogChannelID);
    guild
      .fetchAuditLogs({ type: AuditLogEvent.ChannelCreate })
      .then((logs) =>
        logs.entries.find((entry) => entry.target.id == channel.id)
      )
      .then((entry) => {
        let author = entry.executor;
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setDescription(`A channel was created`)
              .addFields(
                {
                  name: "Creator",
                  value: `${author}`,
                  inline: true,
                },
                {
                  name: "Channel:",
                  value: `${channel}`,
                  inline: true,
                },
                {
                  name: "Parent:",
                  value: `${
                    channel.parent === null ? "No Parent" : channel.parent
                  }`,
                }
              )
              .setFooter({
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                text: "Ryou - Logs",
              })
              .setAuthor({
                name: "Channel Create",
                iconURL: `${guild.iconURL({ dynamic: true })}`,
              })
              .setTimestamp(),
          ],
        });
      });
  },
};
