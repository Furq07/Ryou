const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");

// This event send message(s) in the log channel(s) about role update like (role name, permission (addition/removal))
module.exports = {
  name: "roleUpdate",
  async execute(oldRole, newRole, client) {
    // Checking after fethching all data
    let setupData = await setupDB.findOne({ GuildID: oldRole.guild.id });
    if (!setupData || !setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
    if (setupData.LogRoleUpdateSetup === false) return;

    // Name
    if (newRole.name && oldRole.name !== newRole.name) {
      oldRole.guild
        .fetchAuditLogs({ type: AuditLogEvent.RoleUpdate })
        .then((logs) =>
          logs.entries.find((entry) => entry.target.id == oldRole.id)
        )
        .then((entry) => {
          author = entry.executor;
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setDescription(`A role was renamed`)
                .addFields(
                  { name: "Before:", value: `\`\`\`${oldRole.name}\`\`\`` },
                  { name: "After:", value: `\`\`\`${newRole.name}\`\`\`` },
                  { name: "Editor:", value: `${author}` }
                )
                .setFooter({
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  text: "Ryou - Logs",
                })
                .setAuthor({
                  name: "Role Re-name",
                  iconURL: `${oldRole.guild.iconURL({ dynamic: true })}`,
                })

                .setTimestamp(),
            ],
          });
        });
    } else if (
      newRole.permissions &&
      oldRole.permissions !== newRole.permissions
    ) {
      oldRole.guild
        .fetchAuditLogs({ type: AuditLogEvent.RoleUpdate })
        .then((logs) =>
          logs.entries.find((entry) => entry.target.id == newRole.id)
        )
        .then((entry) => {
          author = entry.executor;
          // Permission(s) addition
          if (oldRole.permissions < newRole.permissions) {
            const namesToDeleteArr = oldRole.permissions.toArray();
            let newRolePermissions = newRole.permissions.toArray();
            const permissionsToDeleteSet = new Set(namesToDeleteArr);
            const newArr = newRolePermissions
              .filter((name) => {
                return !permissionsToDeleteSet.has(name);
              })
              .join(", ");
            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("#800000")
                  .setDescription(`Role permission(s) have been updated.`)
                  .addFields(
                    { name: "Name:", value: `${oldRole.name}`, inline: true },
                    { name: "ID:", value: `${oldRole.id}`, inline: true },
                    {
                      name: "Permission Added:",
                      value: `\`\`\`${newArr}\`\`\``,
                    },
                    { name: "Editor:", value: `${author}` }
                  )
                  .setFooter({
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                    text: "Ryou - Logs",
                  })
                  .setAuthor({
                    name: "Role Permissions",
                    iconURL: `${oldRole.guild.iconURL({ dynamic: true })}`,
                  })

                  .setTimestamp(),
              ],
            });
          } else {
            // Permission(s) removal
            const namesToDeleteArr = newRole.permissions.toArray();
            let newRolePermissions = oldRole.permissions.toArray();
            const permissionsToDeleteSet = new Set(namesToDeleteArr);
            const newArr = newRolePermissions
              .filter((name) => {
                return !permissionsToDeleteSet.has(name);
              })
              .join(", ");
            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("#800000")
                  .setDescription(`Role permission(s) have been updated`)
                  .addFields(
                    { name: "Name:", value: `${oldRole.name}`, inline: true },
                    { name: "ID:", value: `${oldRole.id}`, inline: true },
                    {
                      name: "Permission Removed:",
                      value: `\`\`\`${newArr}\`\`\``,
                    },
                    { name: "Editor:", value: `${author}` }
                  )
                  .setFooter({
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                    text: "Ryou - Logs",
                  })
                  .setAuthor({
                    name: "Role Permissions",
                    iconURL: `${oldRole.guild.iconURL({ dynamic: true })}`,
                  })

                  .setTimestamp(),
              ],
            });
          }
        })
        .catch(() => {
          return;
        });
    }
  },
};
