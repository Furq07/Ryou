// [-------------------[Imports]-------------------]
const { EmbedBuilder, ChannelType, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
// [-------------------[File Initiation]-------------------]
module.exports = {
  name: "guildCreate",
  execute(guild, client) {
    // [-------------------[Join Message]-------------------]
    let channelToSend;
    const embed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle("Thank You for Adding Me!")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou",
      });
    guild.channels.cache.forEach((channel) => {
      if (channel.type == ChannelType.GuildText && !channelToSend)
        channelToSend = channel;
    });
    if (!channelToSend) {
      guild
        .fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 1 })
        .then((log) => {
          log.entries.first().executor.send({
            embeds: [
              embed.setDescription(
                `
              Hi I go by **Ryou**.
              I'm at your server to manage it.
              
              To start off, you must set me up.
              Use the command </setup:1008455318881189948> for that!
              
              If this is your second time adding me,
              it's conceivable that I'm already set up,
              but it's ideal if you do it again!
              `
              ),
            ],
          });
        });
      return;
    }
    channelToSend.send({
      embeds: [
        embed.setDescription(
          `
        Hi I go by **Ryou**.
        I'm at your server to manage it.
              
        To start off, you must set me up.
        Use the command </setup:1008455318881189948> for that!
              
        If this is your second time adding me,
        it's conceivable that I'm already set up,
        but it's ideal if you do it again!
        `
        ),
      ],
    });
    new setupDB({
      GuildID: guild.id,
    }).save();
  },
};
