const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
  name: "loveratio",
  description: "Calculate the love ratio between yourself and your love",
  options: [
    {
      name: "yourlove",
      description: "Who is your love?",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async execute(interaction, client) {
    let loveRatio = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#800000")
          .setTitle("Love ratio calculator")
          .setDescription(
            `The love ratio between ${
              interaction.user
            } and ${interaction.options.getMember("yourlove")} is ${loveRatio}`
          )
          .setFooter({
            text: "Ryou - Fun",
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          }),
      ],
    });
  },
};
