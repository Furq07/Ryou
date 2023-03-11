const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../../src/models/setupDB");
module.exports = {
  name: "guildBanRemove",
  async execute(member, client) {
    const { guild } = member;
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    // if (
    //   !setupData ||
    //   !setupData.LogChannelID ||
    //   !setupData.LogUnbanSetup ||
    //   !setupData.LogUnbanSetup === false
    // )
    //   return;

    guild
      .fetchAuditLogs({ type: AuditLogEvent.GuildBanRemove })
      .then(async (audit) => {
        const { executer } = audit.entries.first();

        const LogChannel = guild.channels.cache.get(
          `${setupData.LogChannelID}`
        );
        LogChannel.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: "Log: Member Unban",
                iconURL: guild.iconURL({ dynamic: true }),
              })
              .setColor("#800000")
              .addFields(
                {
                  name: "Member Name",
                  value: `${member.user.username} (${member})`,
                },
                { name: "Member ID", value: `${member.id}` },
                { name: "Unbanned By", value: `${executer}` }
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
