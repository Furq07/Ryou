const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AuditLogEvent,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "guildBanAdd",
  async execute(ban, client) {
    let setupData = await setupDB.findOne({ GuildID: ban.guild.id });
    if (!setupData) return;
    if (!setupData.logChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.logChannelID}`);
    ban.guild
      .fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd })
      .then((audit) => {
        let banReason = audit.entries.first().reason;
        let author = audit.entries.first().executor;
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setDescription(`A user was banned`)
              .addFields(
                {
                  name: "User:",
                  value: `<@${ban.user.id}>`,
                  inline: true,
                },
                {
                  name: "ID:",
                  value: `${ban.user.id}`,
                  inline: true,
                },
                {
                  name: "Reason:",
                  value: `${banReason || "No Reason given"}`,
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
                name: "User Ban",
                iconURL: `${ban.guild.iconURL({ dynamic: true })}`,
              })
              .setTimestamp(),
          ],

          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("unban-button")
                .setLabel("Unban")
                .setStyle(ButtonStyle.Primary)
            ),
          ],
        });
      });
  },
};
