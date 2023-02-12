const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const { CaptchaGenerator } = require("captcha-canvas");
const captchaDB = require("../../src/models/captchaDB");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, member, guild } = interaction;
    if (!interaction.isButton() || customId !== "VerifyButton") return;
    const captchaData = await captchaDB.findOne({ GuildID: guild.id });
    const setupData = await setupDB.findOne({ GuildID: guild.id });
    if (setupData.VerificationMode === true) {
      const captchaFound = captchaData.Captchas.find((element) => {
        if (element.id === member.id) {
          return element;
        }
      });
      if (captchaFound) {
        const captcha1 = new CaptchaGenerator()
          .setDimension(100, 280)
          .setDecoy({ opacity: 1, color: "gray" })
          .setTrace({ color: "#3DED97" })
          .setCaptcha({
            text: `${captchaFound.captcha}`,
            color: "#3DED97",
            size: 40,
          });
        const buffer1 = captcha1.generateSync();
        const captchaAttachment = new AttachmentBuilder(buffer1, {
          name: "captcha.png",
        });
        interaction.reply({
          ephemeral: true,
          files: [captchaAttachment],
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setTitle("⚠ Verification Required")
              .setDescription(
                "Click on the **Verify** button below to fill your captcha"
              )
              .setImage("attachment://captcha.png"),
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
      } else {
        function generateWord() {
          const alphabet = "abcdefghijkmnopqrstuvwxyz";
          const alphabet_capital = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
          let word = "";
          for (let i = 0; i < 5; i++) {
            if (Math.random() < 0.5) {
              word += alphabet.charAt(
                Math.floor(Math.random() * alphabet.length)
              );
            } else {
              word += alphabet_capital.charAt(
                Math.floor(Math.random() * alphabet_capital.length)
              );
            }
          }
          return word;
        }

        const captcha = new CaptchaGenerator()
          .setDimension(100, 300)
          .setDecoy({ opacity: 1, color: "gray" })
          .setTrace({ color: "#3DED97" })
          .setCaptcha({
            text: `${generateWord()}`,
            color: "#3DED97",
            size: 40,
          });
        const buffer = captcha.generateSync();
        const captchaAttachment1 = new AttachmentBuilder(buffer, {
          name: "captcha.png",
        });
        interaction.reply({
          ephemeral: true,
          files: [captchaAttachment1],
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setTitle("⚠ Verification Required")
              .setDescription(
                "Click on the **Verify** button below to fill your captcha"
              )
              .setImage("attachment://captcha.png"),
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
        await captchaDB.updateOne(
          {
            GuildID: guild.id,
          },
          {
            $addToSet: {
              Captchas: { id: member.id, captcha: captcha.text },
            },
          }
        );
      }
    }
    if (setupData.VerificationMode === false) {
      guild.members.fetch(`${member.id}`).then(async (user) => {
        const CommunityRole = guild.roles.cache.find(
          (r) => r.id === `${setupData.CommunityRoleID}`
        );
        user.roles.add(CommunityRole);
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setTitle("✅ Successuflly verified")
              .setDescription("You have been successfully verified"),
          ],
          components: [],
          files: [],
          ephemeral: true,
        });
      });
    }
  },
};
