const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "guildMemberRemove",
  async execute(member, client) {
    let setupData = await setupDB.findOne({ GuildID: member.guild.id });
    if (!setupData) return;
    if (!setupData.logChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.logChannelID}`);
    if (member.bannable !== true) {
      member.guild
        .fetchAuditLogs({ type: AuditLogEvent.MemberKick })
        .then((audit) => {
          let kickReason = audit.entries.first().reason;
          let author = audit.entries.first().executor;
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setDescription(`A user was kicked`)
                .addFields(
                  {
                    name: "User:",
                    value: `<@${member.user.id}>`,
                    inline: true,
                  },
                  {
                    name: "ID:",
                    value: `${member.user.id}`,
                    inline: true,
                  },
                  {
                    name: "Reason:",
                    value: `${kickReason || "No Reason given"}`,
                  },
                  {
                    name: "Moderator",
                    value: `${author}`,
                  }
                )
                .setFooter({
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  text: "Ryou - Logs",
                })
                .setAuthor({
                  name: "User Kick",
                  iconURL: `${member.guild.iconURL({ dynamic: true })}`,
                })
                .setTimestamp(),
            ],
          });
        });
    }
  },
};
