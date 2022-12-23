const {
  Client,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
  EmbedBuilder,
} = require("discord.js");
const { CaptchaGenerator } = require("captcha-canvas");
const { Captcha } = require("captcha-canvas");
const { ButtonBuilder } = require("@discordjs/builders");
const captchaDB = require("../../src/models/captchaDB");
module.exports = {
  name: "captcha",
  description: "Captcha verification",
  async execute(interaction, client) {
    function generateWord() {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      const numbers = "0123456789";
      let word = "";
      for (let i = 0; i < 5; i++) {
        if (Math.random() < 0.5) {
          word += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        } else {
          word += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
      }
      return word;
    }

    const captcha = new CaptchaGenerator()
      .setDimension(150, 450)
      .setDecoy({ opacity: 0.5 })
      .setTrace({ color: "gray" })
      .setCaptcha({ text: `${generateWord()}`, color: "black", size: 60 });
    const buffer = captcha.generateSync();

    interaction.reply({
      ephemeral: true,
      content: `Here is your captcha: ${captcha.text}`,
      files: [
        {
          attachment: buffer,
          name: "captcha.png",
        },
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("captcha-verify")
            .setLabel("Verify")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });
    collector.on("collect", async (collected) => {
      if (collected.customId === "captcha-verify") {
        const changeuserModal = new ModalBuilder()
          .setCustomId(`captcha-modal`)
          .setTitle(`Captcha verification`);

        const changeUserLimitTextInput = new TextInputBuilder()
          .setCustomId(`captcha-verify-input`)
          .setLabel(`Enter the code below`)
          .setRequired(true)
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("Captcha code (eg: 9cwsk)")
          .setMaxLength(5)
          .setMinLength(5);
        changeuserModal.addComponents(
          new ActionRowBuilder().addComponents(changeUserLimitTextInput)
        );
        collected.showModal(changeuserModal);
      }
    });
  },
};
