const { EmbedBuilder } = require("discord.js");
const { request } = require("undici");
module.exports = {
  name: "advice",
  description: "Generate a random piece of advice",
  async execute(interaction, client) {
    request("https://api.adviceslip.com/advice")
      .then((res) => res.body.json())
      .then((result) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setTitle("Here is a little advice for you")
              .addFields({
                name: "Advice:",
                value: `\**"**${
                  result.slip.advice ===
                  "Try buying a coffee for the creator of a free public API, now and then."
                    ? (result.slip.advice =
                        "Try buying a coffee for the bot developers, now and then")
                    : result.slip.advice.replace(/\.$/, "")
                }\**"**`,
              })
              .setFooter({
                text: "Ryou - Fun",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp(),
          ],
        });
      });
  },
};
