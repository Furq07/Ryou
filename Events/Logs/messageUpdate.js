const { EmbedBuilder } = require("discord.js");
const setupDB = require("../../src/models/setupDB");

// This event send message(s) in the log channel(s) about message update
module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    // Checking after fethching all data
    let setupData = await setupDB.findOne({ GuildID: oldMessage.guild.id });
    if (!setupData || !setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
    if (setupData.LogMessageUpdateSetup === false) return;

    // Main piece of code
    if (
      oldMessage.content.length !== 0 &&
      !oldMessage.content.includes("http")
    ) {
      logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#800000")
            .setDescription(`A message was edited`)
            .addFields(
              {
                name: "User:",
                value: `<@${oldMessage.author.id}> (${oldMessage.author.id})`,
              },
              {
                name: "Original Message:",
                value: `\`\`\`${
                  oldMessage.content.length >= 1024
                    ? oldMessage.content.slice(0, 1024 / 2) + "..."
                    : oldMessage.content
                }\`\`\``,
              },
              {
                name: "After Edit:",
                value: `\`\`\`${
                  newMessage.content.length >= 1024
                    ? newMessage.content.slice(0, 1024 / 2) + "..."
                    : newMessage.content
                }\`\`\``,
              },
              { name: "Channel:", value: `<#${newMessage.channel.id}>` }
            )
            .setFooter({
              text: "Ryou - Logs",
            })
            .setAuthor({
              name: "Message Edit",
              iconURL: `${oldMessage.guild.iconURL({ dynamic: true })}`,
            })
            .setTimestamp(),
        ],
      });
    }
  },
};
