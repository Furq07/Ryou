const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { request } = require("undici");
const config = require("../../src/config.json");
module.exports = {
  name: "weather",
  description: "Get information about the weather of any city",
  options: [
    {
      name: "city",
      description: "Enter the name of the city",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async execute(interaction, client) {
    let city = interaction.options.getString("city");
    if (city.length > 17)
      return interaction.reply({
        content:
          "The name of the city that you provided is too long, try again with shorter name",
        ephemeral: true,
      });
    request(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${config.weatherApiKey}`
    )
      .then((res) => res.body.json())
      .then((result) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setTitle(`Weather in ${city}`)
              .setDescription(
                `**Temperature**: ${Math.floor(
                  result.main.temp
                )}°C\n**Humidity**: ${result.main.humidity}\n**Wind**: ${
                  Math.floor(result.wind.speed * 3.6) === 0
                    ? "None"
                    : Math.floor(result.wind.speed * 3.6) + " km/h"
                }\n**Pressure**: ${result.main.pressure}\n**Longitude**: ${
                  result.coord.lon
                }\n **Latitude**: ${result.coord.lat}`
              )
              .setFooter({
                text: "Ryou - Fun",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              }),
          ],
        });
      })
      .catch((err) => {
        interaction.reply({
          ephemeral: true,
          content: `Invalid city name: \`${city}\`, try again with valid city name`,
        });
      });
  },
};
