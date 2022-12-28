const { EmbedBuilder } = require("discord.js");
const { request } = require("undici");
module.exports = {
  name: "fact",
  description: "Generate a random fact",
  async execute(interaction, client) {
    request("https://nekos.life/api/v2/fact")
      .then((res) => res.body.json())
      .then((result) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setTitle("Random fact")
              .addFields({
                name: "Fact:",
                value: `\**"**${result.fact}\**"**`,
              })
              .setFooter({
                text: "Ryou - Fun",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              }),
          ],
        });
      });
  },
};
