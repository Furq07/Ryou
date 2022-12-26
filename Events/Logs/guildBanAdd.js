const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AuditLogEvent,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");

// This event send message(s) in the log channel(s) about a user who was banned
module.exports = {
  name: "guildBanAdd",
  async execute(ban, client) {
    // Checking after fetching all data
    let setupData = await setupDB.findOne({ GuildID: ban.guild.id });
    if (!setupData || !setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
    if (setupData.LogBanSetup === false) return;

    // Main piece of code
    ban.guild
      .fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd })
      .then((audit) => {
        let banReason = audit.entries.first().reason;
        let author = audit.entries.first().executor;
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setDescription(`A user has been banned`)
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
