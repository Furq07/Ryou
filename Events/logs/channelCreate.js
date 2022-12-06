const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "channelCreate",
  async execute(channel, client) {
    let setupData = await setupDB.findOne({ GuildID: channel.guild.id });
    if (!setupData) return;
    if (!setupData.logChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.logChannelID}`);
    let channelType = "";
    if (channel.isVoiceBased()) {
      channelType = "Voice";
    } else if (channel.isTextBased) {
      channelType = "Text";
    }
    if (channel.name === "Join to Create" || channel.name === "Custom Vcs")
      return;
    if (channel.name.includes("'s Vc")) return;
    channel.guild
      .fetchAuditLogs({ type: AuditLogEvent.ChannelCreate })
      .then((logs) =>
        logs.entries.find((entry) => entry.target.id == channel.id)
      )
      .then((entry) => {
        author = entry.executor;
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setDescription(`A channel was created`)
              .addFields(
                {
                  name: "Name:",
                  value: `<#${channel.id}>`,
                  inline: true,
                },
                {
                  name: "Type:",
                  value: `${channelType}`,
                  inline: true,
                },
                {
                  name: "Parent:",
                  value: `${channel.parent}`,
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
                name: "Channel Create",
                iconURL: `${channel.guild.iconURL({ dynamic: true })}`,
              })
              .setTimestamp(),
          ],
        });
      });
  },
};
