const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  // This event will send message(s) in the log channel(s) about channel(s) deletion if it's enabled
  name: "channelDelete",
  async execute(channel, client) {
    // Checking after fetching all data
    let setupData = await setupDB.findOne({ GuildID: channel.guild.id });
    if (!setupData || !setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
    if (channel.name.includes("'s Vc")) return;
    if (setupData.LogChannelCreateSetup === false) return;

    // Determining the channel type
    let channelType = "";
    if (channel.isVoiceBased()) channelType = "Voice";
    else if (channel.isTextBased) channelType = "Text";

    // Maine piece of code
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
                  value: `${
                    channel.parent !== null ? channel.parnt : "No parent"
                  }`,
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
