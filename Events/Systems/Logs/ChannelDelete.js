const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../../src/models/setupDB");
module.exports = {
  name: "channelDelete",
  async execute(channel, client) {
    const { guild, name, id } = channel;
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    // if (
    //   !setupData ||
    //   !setupData.LogChannelID ||
    //   !setupData.LogChannelDeleteSetup ||
    //   !setupData.LogChannelDeleteSetup === false
    // )
    //   return;

    guild
      .fetchAuditLogs({ type: AuditLogEvent.ChannelDelete })
      .then(async (audit) => {
        const { executer } = audit.entries.first();

        let type = channel.type;
        if (type === 0) type = "Text";
        if (type === 2) type = "Voice";
        if (type === 13) type = "Stage";
        if (type === 15) type = "Form";
        if (type === 5) type = "Announcement";
        else type = "Category";

        const LogChannel = guild.channels.cache.get(
          `${setupData.LogChannelID}`
        );
        LogChannel.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: "Log: Channel Delete",
                iconURL: guild.iconURL({ dynamic: true }),
              })
              .setColor("#800000")
              .addFields(
                { name: "Channel Name", value: `${name}` },
                { name: "Channel Type", value: `${type}` },
                { name: "Channel ID", value: `${id}` },
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
