const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  AttachmentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const captchaDB = require("../../src/models/captchaDB");
const { createCaptcha } = require("captcha-canvas");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { guild, member, customId, channel } = interaction;
    if (
      !interaction.isButton() ||
      !["VerifyButton", "VerifyCaptcha"].includes(customId)
    )
      return;
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    if (customId === "VerifyButton") {
      if (setupData.VerificationMode === false) {
        const CommunityRole = guild.roles.cache.find(
          (r) => r.id === setupData.CommunityRoleID
        );
        member.roles.add(CommunityRole);
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setDescription("You have been Verified!"),
          ],
          ephemeral: true,
        });
      } else {
        const captcha = await createCaptcha(350, 250);
        const captchaAttachment = new AttachmentBuilder(await captcha.image, {
          name: "captcha.png",
        });
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`Complete the captcha to verify!`)
              .setImage("attachment://captcha.png")
              .setColor("#800000"),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("VerifyCaptcha")
                .setStyle(ButtonStyle.Success)
                .setLabel("Solve")
            ),
          ],
          files: [captchaAttachment],
          allowedMentions: { repliedUser: false },
          ephemeral: true,
        });
        new captchaDB({
          GuildID: guild.id,
          MemberID: member.id,
          Code: captcha.text,
        }).save();
      }
    } else if (customId === "VerifyCaptcha") {
      const modal = new ModalBuilder()
        .setCustomId(`CaptchaModal`)
        .setTitle(`Solve the Captcha!`);

      const textInput = new TextInputBuilder()
        .setCustomId(`CaptchaInput`)
        .setLabel(`Enter the Code Below:`)
        .setMinLength(6)
        .setMaxLength(6)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("For Example: 2G6aTu");
      modal.addComponents(new ActionRowBuilder().addComponents(textInput));
      await interaction.showModal(modal);
    }
  },
};
