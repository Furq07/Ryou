const { EmbedBuilder } = require("discord.js");
const { request } = require("undici");
module.exports = {
  name: "quote",
  description: "Generate famous quotes",
  async execute(interaction, client) {
    request("https://api.quotable.io/random")
      .then((res) => res.body.json())
      .then((result) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setTitle("Quote Generator")
              .addFields(
                {
                  name: "Quote:",
                  value: `\**"**${result.content.replace(/\.$/, "")}\**"**`,
                },
                { name: "Author:", value: `${result.author}` }
              )
              .setFooter({
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                text: "Ryou - Fun",
              })
            ,
          ],
        });
      });
  },
};
