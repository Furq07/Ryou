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
      content: `**\"**${interaction.options.getString("message")}**\"**`,
    });
  },
};
