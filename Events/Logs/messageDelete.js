const { EmbedBuilder } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "messageDelete",
  async execute(message, client) {
    let setupData = await setupDB.findOne({ GuildID: message.guild.id });
    if (!setupData) return;
    if (!setupData.logChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.logChannelID}`);
    if (message.content.length !== 0) {
      logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#800000")
            .setDescription(`A strange message was deleted`)
            .addFields(
              {
                name: "User:",
                value: `<@${message.author.id}> (${message.author.id})`,
              },
              { name: "Message:", value: `\`${message.content}\`` },
              { name: "Channel:", value: `<#${message.channel.id}>` }
            )
            .setFooter({
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
              text: "Ryou - Logs",
            })
            .setAuthor({
              name: "Message Delete",
              iconURL: `${message.guild.iconURL({ dynamic: true })}`,
            })
            .setTimestamp(),
        ],
      });
    }
  },
};