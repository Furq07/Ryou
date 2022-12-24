const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "channelDelete",
  async execute(channel, client) {
    let setupData = await setupDB.findOne({ GuildID: channel.guild.id });
    if (!setupData) return;
    if (!setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
    let channelType = "";
    if (channel.isVoiceBased()) {
      channelType = "Voice";
    } else if (channel.isTextBased) {
      channelType = "Text";
    }
    if (channel.name.includes("'s Vc")) return;
    channel.guild
      .fetchAuditLogs({ type: AuditLogEvent.ChannelDelete })
      .then((logs) =>
        logs.entries.find((entry) => entry.target.id == channel.id)
      )
      .then((entry) => {
        author = entry.executor;
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setDescription(`A channel was deleted`)
              .addFields(
                {
                  name: "Name:",
                  value: `#${channel.name}`,
                  inline: true,
                },
                {
                  name: "Parent:",
                  value: `${channel.parent}`,
                  inline: true,
                },
                {
                  name: "Type:",
                  value: `${channelType}`,
                },
                {
                  name: "Creator",
                  value: `${author}`,
                  inline: true,
                }
              )
              .setFooter({
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                text: "Ryou - Logs",
              })
              .setAuthor({
                name: "Channel Delete",
                iconURL: `${channel.guild.iconURL({ dynamic: true })}`,
              })
              .setTimestamp(),
          ],
        });
      });
  },
};
