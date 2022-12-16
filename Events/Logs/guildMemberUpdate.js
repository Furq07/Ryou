const { EmbedBuilder, AuditLogEvent, time } = require("discord.js");
const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember, client) {
    let setupData = await setupDB.findOne({ GuildID: oldMember.guild.id });
    if (!setupData) return;
    if (!setupData.logChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.logChannelID}`);
    const removedRoles = oldMember.roles.cache.filter(
      (role) => !newMember.roles.cache.has(role.id)
    );
    const addedRoles = newMember.roles.cache.filter(
      (role) => !oldMember.roles.cache.has(role.id)
    );
    //Nickname
    if (newMember.nickname && oldMember.nickname !== newMember.nickname) {
      let nickname = "";
      if (oldMember.nickname !== oldMember.user.username) {
        nickname = oldMember.nickname;
      }
      logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#800000")
            .setDescription(`A user has changed their nickname`)
            .addFields(
              {
                name: "User:",
                value: `@${oldMember.user.username} (${oldMember.user.id})`,
              },
              {
                name: "Before:",
                value: `\`${nickname ?? oldMember.user.username}\``,
              },
              { name: "After:", value: `\`${newMember.nickname}\`` }
            )
            .setFooter({
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
              text: "Ryou - Logs",
            })
            .setAuthor({
              name: "Nickname Change",
              iconURL: `${oldMember.guild.iconURL({ dynamic: true })}`,
            })
            .setTimestamp(),
        ],
      });
    }
    // Role removal
    else if (removedRoles.size > 0) {
      roles = removedRoles.map((r) => " " + "(" + r.hexColor + ") " + r.name);
      logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#800000")
            .setDescription(`A user roles were changed`)
            .addFields(
              {
                name: "User:",
                value: `<@${oldMember.user.id}> (${oldMember.user.id})`,
              },
              {
                name: "Roles:",
                value: `${roles}`,
              },
              { name: "Type:", value: `Removal` }
            )
            .setFooter({
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
              text: "Ryou - Logs",
            })
            .setAuthor({
              name: "Role Change",
              iconURL: `${oldMember.guild.iconURL({ dynamic: true })}`,
            }),
        ],
      });
    }
    // Rele Addition
    else if (addedRoles.size > 0) {
      roles = addedRoles.map((r) => " " + "(" + r.hexColor + ") " + r.name);
      logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#800000")
            .setDescription(`A user roles were changed`)
            .addFields(
              {
                name: "User:",
                value: `<@${oldMember.user.id}> (${oldMember.user.id})`,
              },
              {
                name: "Roles:",
                value: `${roles}`,
              },
              { name: "Type:", value: `Addition` }
            )
            .setFooter({
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
              text: "Ryou - Logs",
            })
            .setAuthor({
              name: "Role Change",
              iconURL: `${oldMember.guild.iconURL({ dynamic: true })}`,
            }),
        ],
      });
    }
    // Member Muted
    else if (newMember.isCommunicationDisabled(true)) {
      newMember.guild
        .fetchAuditLogs({ type: AuditLogEvent.MemberUpdate })
        .then((logs) =>
          logs.entries.find((entry) => entry.target.id == newMember.user.id)
        )
        .then((entry) => {
          reason = entry.reason;
          author = entry.executor;
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setDescription(`A user was muted`)
                .addFields(
                  {
                    name: "ID:",
                    value: `${newMember.user.id}`,
                  },
                  {
                    name: "Name:",
                    value: `<@${newMember.user.id}>`,
                  },
                  {
                    name: "Reason:",
                    value: `${reason || "No Reason given"}`,
                  },
                  {
                    name: "Expiry:",
                    value: `${
                      time(newMember.communicationDisabledUntil) ?? "No time"
                    }`,
                  },
                  {
                    name: "Punisher:",
                    value: `${author}`,
                  }
                )
                .setFooter({
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  text: "Ryou - Logs",
                })
                .setAuthor({
                  name: "User Mute",
                  iconURL: `${newMember.guild.iconURL({ dynamic: true })}`,
                })
                .setTimestamp(),
            ],
          });
        });
    } else {
      newMember.guild
        .fetchAuditLogs({ type: AuditLogEvent.MemberUpdate })
        .then((logs) =>
          logs.entries.find((entry) => entry.target.id == newMember.user.id)
        )
        .then((entry) => {
          reason = entry.reason;
          author = entry.executor;
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setDescription(`A user was unmuted`)
                .addFields(
                  {
                    name: "ID:",
                    value: `${newMember.user.id}`,
                  },
                  {
                    name: "Name:",
                    value: `<@${newMember.user.id}>`,
                  },
                  {
                    name: "Reason:",
                    value: `${reason || "No Reason given"}`,
                  },
                  {
                    name: "Saver:",
                    value: `${author}`,
                  }
                )
                .setFooter({
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  text: "Ryou - Logs",
                })
                .setAuthor({
                  name: "User Unmute",
                  iconURL: `${newMember.guild.iconURL({ dynamic: true })}`,
                })
                .setTimestamp(),
            ],
          });
        });
    }
  },
};
