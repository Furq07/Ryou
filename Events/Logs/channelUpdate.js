const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const setupDB = require("../../src/models/setupDB");

// This event send message(s) in the log channel(s) about a channel like (Channnel name, topic change)
module.exports = {
  name: "channelUpdate",
  async execute(oldChannel, newChannel, client) {
    // Checking after fetching all data
    let setupData = await setupDB.findOne({ GuildID: oldChannel.guild.id });
    if (!setupData || !setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
    if (setupData.LogChannelUpdateSetup === false) return;

    // Channel name
    if (newChannel.name && oldChannel.name !== newChannel.name) {
      oldChannel.guild
        .fetchAuditLogs({ type: AuditLogEvent.ChannelUpdate })
        .then((logs) =>
          logs.entries.find((entry) => entry.target.id == oldChannel.id)
        )
        .then((entry) => {
          author = entry.executor;
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setDescription(`A channel's name has been changed.`)
                .addFields(
                  {
                    name: "Before:",
                    value: `\`\`\`#${oldChannel.name}\`\`\``,
                  },
                  {
                    name: "After:",
                    value: `\`\`\`#${newChannel.name}\`\`\``,
                  },
                  {
                    name: "Changer:",
                    value: `${author}`,
                  }
                )
                .setFooter({
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  text: "Ryou - Logs",
                })
                .setAuthor({
                  name: "Channel Update",
                  iconURL: `${oldChannel.guild.iconURL({ dynamic: true })}`,
                })
                .setTimestamp(),
            ],
          });
          ``;
        });
    }

    // Channel Topic
    if (newChannel.topic && oldChannel.topic !== newChannel.topic) {
      oldChannel.guild
        .fetchAuditLogs({ type: AuditLogEvent.ChannelUpdate })
        .then((logs) =>
          logs.entries.find((entry) => entry.target.id == oldChannel.id)
        )
        .then((entry) => {
          author = entry.executor;
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setDescription(`A channel topic was changed`)
                .addFields(
                  {
                    name: "Before:",
                    value: `${oldChannel.topic}`,
                    inline: true,
                  },
                  {
                    name: "After:",
                    value: `${newChannel.topic}`,
                    inline: true,
                  },
                  {
                    name: "Changer:",
                    value: `${author}`,
                  }
                )
                .setFooter({
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  text: "Ryou - Logs",
                })
                .setAuthor({
                  name: "Channel Update",
                  iconURL: `${oldChannel.guild.iconURL({ dynamic: true })}`,
                })
                .setTimestamp(),
            ],
          });
          ``;
        });
    }
  },
};
