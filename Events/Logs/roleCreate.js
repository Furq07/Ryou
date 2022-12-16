const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "roleCreate",
  async execute(role, client) {
    let setupData = await setupDB.findOne({ GuildID: role.guild.id });
    if (!setupData) return;
    if (!setupData.logChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.logChannelID}`);
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
