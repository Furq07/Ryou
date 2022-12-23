const {
  InteractionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, type, fields } = interaction;
    if (type == InteractionType.ModalSubmit && customId === "captcha-modal") {
      const captchaVerifyInput = fields.getTextInputValue(
        "captcha-verify-input"
      );
      
    }
  },
};
