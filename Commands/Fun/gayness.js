const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "gayness",
  description: "Find your gayness",
  async execute(interaction, client) {
    const randomPercentage = Math.floor(Math.random() * (100 - 1 + 1) + 1);
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#800000")
          .setTitle("Gayness checker")
          .setDescription(
            `${interaction.user} you are ${randomPercentage}% gay`
          )
          .setFooter({
            text: "Ryou - Fun",
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          }),
      ],
    });
  },
};
