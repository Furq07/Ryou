const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../../src/models/setupDB");
module.exports = {
  name: "channelCreate",
  async execute(channel, client) {
    const { guild, name, id } = channel;
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    // if (
    //   !setupData ||
    //   !setupData.LogChannelID ||
    //   !setupData.LogChannelCreateSetup ||
    //   !setupData.LogChannelCreateSetup === false
    // )
    //   return;

    guild
      .fetchAuditLogs({ type: AuditLogEvent.ChannelCreate })
      .then(async (audit) => {
        const { executer } = audit.entries.first();
        const LogChannel = guild.channels.cache.get(
          `${setupData.LogChannelID}`
        );

        let type = channel.type;
        if (type === 0) type = "Text";
        if (type === 2) type = "Voice";
        if (type === 13) type = "Stage";
        if (type === 15) type = "Form";
        if (type === 5) type = "Announcement";
        else type = "Category";
        LogChannel.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: "Log: Channel Create",
                iconURL: guild.iconURL({ dynamic: true }),
              })
              .setColor("#800000")
              .addFields(
                { name: "Channel Name", value: `${name} (${channel})` },
                { name: "Channel Type", value: `${type}` },
                { name: "Channel ID", value: `${id}` },
                { name: "Created By", value: `${executer}` }
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
