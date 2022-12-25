const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "roleDelete",
  async execute(role, client) {
    let setupData = await setupDB.findOne({ GuildID: role.guild.id });
    if (!setupData) return;
    if (!setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
    if (setupData.LogRoleDeleteSetup === false) return;

    role.guild
      .fetchAuditLogs({ type: AuditLogEvent.RoleDelete })
      .then((logs) => logs.entries.find((entry) => entry.target.id == role.id))
      .then((entry) => {
        author = entry.executor;
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setDescription(`A role was deleted`)
              .addFields(
                {
                  name: "Name:",
                  value: `${role.name} (${role.id})`,
                },
                {
                  name: "Deleter",
                  value: `${author}`,
                }
              )
              .setFooter({
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                text: "Ryou - Logs",
              })
              .setAuthor({
                name: "Role Delete",
                iconURL: `${role.guild.iconURL({ dynamic: true })}`,
              })
              .setTimestamp(),
          ],
        });
      });
  },
};
