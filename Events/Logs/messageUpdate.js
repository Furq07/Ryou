const { EmbedBuilder } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    let setupData = await setupDB.findOne({ GuildID: oldMessage.guild.id });
    if (!setupData) return;
    if (!setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
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
              { name: "Original Message:", value: `\`${oldMessage.content}\`` },
              { name: "After Edit:", value: `\`${newMessage.content}\`` },
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
