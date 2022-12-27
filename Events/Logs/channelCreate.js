const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  // This event will send message(s) in log channel(s) about channel creation if they have enabled logs in their server
  name: "channelCreate",
  async execute(channel, client) {
    // Checking after fetching all data
    let setupData = await setupDB.findOne({ GuildID: channel.guild.id });
    if (!setupData || !setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
    if (channel.name.includes("'s Vc")) return;
    if (
      setupData.LogChannelCreateSetup === false ||
      !setupData.LogChannelCreateSetup
    )
      return;
    if (
      channel.id === setupData.JTCChannelID ||
      channel.id === setupData.JTCCategoryID
    )
      return;

    // Determining the channel type
    let channelType = "";
    if (channel.isVoiceBased()) channelType = "Voice";
    else if (channel.isTextBased()) channelType = "Text";
    else channelType = "Category";
    // Main piece of code
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
                  value: `${
                    channel.parent === null ? "No parent" : channel.parent
                  }`,
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
