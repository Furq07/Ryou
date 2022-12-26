const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");

// This event send message(s) in the log channel(s) about role creation
module.exports = {
  name: "roleCreate",
  async execute(role, client) {
    // Checking after fethching all data
    let setupData = await setupDB.findOne({ GuildID: role.guild.id });
    if (!setupData || !setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
    if (setupData.LogRoleCreateSetup === false) return;

    // Maine piece of code
    role.guild
      .fetchAuditLogs({ type: AuditLogEvent.RoleCreate })
      .then((logs) => logs.entries.find((entry) => entry.target.id == role.id))
      .then((entry) => {
        author = entry.executor;
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setDescription(`A new role was created`)
              .addFields(
                {
                  name: "Name:",
                  value: `${role.name} (${role.id})`,
                },
                {
                  name: "Creator",
                  value: `${author}`,
                }
              )
              .setFooter({
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                text: "Ryou - Logs",
              })
              .setAuthor({
                name: "Role Create",
                iconURL: `${role.guild.iconURL({ dynamic: true })}`,
              })
              .setTimestamp(),
          ],
        });
      });
  },
};
