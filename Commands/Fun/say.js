const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
  name: "say",
  description: "Make bot to repeat your message",
  options: [
    {
      name: "message",
      required: true,
      description: "Enter your message",
      type: ApplicationCommandOptionType.String,
    },
  ],
  async execute(interaction, client) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#800000")
          .setTitle(`${interaction.user.username} said`)
          .addFields({
            name: "Message:",
            value: `**\"**${interaction.options.getString("message")}**\"**`,
          })
          .setFooter({
            text: "Ryou - Fun",
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          }),
      ],
    });
  },
};
