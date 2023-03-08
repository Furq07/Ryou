const { EmbedBuilder } = require("discord.js");
const setupDB = require("../../../src/models/setupDB");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    const { guild, content, author, channel } = oldMessage;
    let Data = await setupDB.findOne({ GuildID: guild.id });
    if (
      !Data ||
      !Data.LogChannelID ||
      !Data.LogMessageUpdateSetup ||
      Data.LogMessageUpdateSetup === false
    )
      return;
    guild.channels.cache.get(setupData.LogChannelID).send({
      embeds: [
        new EmbedBuilder()
          .setColor("#800000")
          .setDescription(`[A Message was Edited!](${newMessage.url})`)
          .setFields(
            {
              name: "User:",
              value: `${author} \`(${oldMessage.author.id})\``,
            },
            { name: "Channel:", value: `${channel}` },
            {
              name: "Original Message:",
              value: `\`\`\`${
                content.length >= 1024
                  ? content.slice(0, 1024 / 2) + "..."
                  : content
              }\`\`\``,
            },
            {
              name: "Edited Message:",
              value: `\`\`\`${
                newMessage.content.length >= 1024
                  ? newMessage.content.slice(0, 1024 / 2) + "..."
                  : newMessage.content
              }\`\`\``,
            }
          )
          .setFooter({
            text: "Ryou - Logs",
            iconURL: client.iconURL({ dynamic: true }),
          })
          .setAuthor({
            name: "Log: Message Edit",
            iconURL: `${guild.iconURL({ dynamic: true })}`,
          }),
      ],
    });
  },
};
