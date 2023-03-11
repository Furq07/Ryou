const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../../src/models/setupDB");
module.exports = {
  name: "messageDelete",
  async execute(message, client) {
    const { guild, channel } = message;
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    // if (
    //   !setupData ||
    //   !setupData.LogChannelID ||
    //   !setupData.LogMessageUpdateSetup ||
    //   !setupData.LogMessageUpdateSetup === false
    // )
    //   return;

    guild
      .fetchAuditLogs({ type: AuditLogEvent.MessageDelete })
      .then(async (audit) => {
        const { executer } = audit.entries.first();

        const msg = message.content;
        if (!msg) return;

        const LogChannel = guild.channels.cache.get(
          `${setupData.LogChannelID}`
        );
        LogChannel.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: "Log: Message Delete",
                iconURL: guild.iconURL({ dynamic: true }),
              })
              .setColor("#800000")
              .addFields(
                { name: "Message Content", value: `\`\`\`${msg}\`\`\`` },
                { name: "Member Channel", value: `${channel}` },
                { name: "Deleted By", value: `${executer}` }
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
