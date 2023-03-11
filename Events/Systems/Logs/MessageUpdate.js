const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../../src/models/setupDB");
module.exports = {
  name: "messageUpdate",
  async execute(message, newMessage, client) {
    const { guild, content, channel } = message;
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    // if (
    //   !setupData ||
    //   !setupData.LogChannelID ||
    //   !setupData.LogMessageUpdate ||
    //   !setupData.LogMessageUpdate === false
    // )
    //   return;

    guild
      .fetchAuditLogs({ type: AuditLogEvent.MessageUpdate })
      .then((logs) =>
        logs.entries.find((entry) => entry.target.id == channel.id)
      )
      .then((entry) => {
        author = entry.executor;

        const LogChannel = guild.channels.cache.get(setupDB.LogChannelID);
        LogChannel.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: "Log: Message Edit",
                iconURL: guild.iconURL({ dynamic: true }),
              })
              .setColor("#800000")
              .addFields(
                { name: "Old Message", value: `\`\`\`${content}\`\`\`` },
                {
                  name: "New Message",
                  value: `\`\`\`${newMessage.content}\`\`\``,
                },
                { name: "Message Channel", value: `${channel}` },
                { name: "Edited By", value: `${executer}` }
              )
              .setFooter({
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                text: "Ryou - Logs",
              }),
          ],
        });
      });
  },
};
