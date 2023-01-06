const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  Embed,
} = require("discord.js");
module.exports = {
  name: "kiss",
  description: "Kiss someone",
  options: [
    {
      name: "user",
      description: "Enter the user whom you want to kiss",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],
  async execute(interaction, client) {
    const user = interaction.options.getMember("user");
    const embed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle("Kiss of love")
      .setDescription(`${user} got a kiss from ${interaction.user} UwU`)
      .setFooter({
        text: "Ryou - Fun",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });
    if (user.id === interaction.user.id) {
      interaction.reply({
        embeds: [
          EmbedBuilder.from(embed).setDescription(
            `${interaction.user} kissed himself :skull:`
          ),
        ],
      });
    } else {
      interaction.reply({
        embeds: [
          EmbedBuilder.from(embed).setDescription(
            `${user} got a kiss from ${interaction.user} UwU`
          ),
        ],
      });
    }
  },
};
