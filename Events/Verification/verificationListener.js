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
    if (!interaction.isButton()) return;
    const { customId, guild, message } = interaction;
    let captchaData = await captchaDB.findOne({ GuildID: guild.id });
    let setupData = await setupDB.findOne({ GuildID: guild.id });

    if (["captcha-verify-button", "normal-verify-button"].includes(customId)) {
      switch (customId) {
        case "captcha-verify-button":
          const captchaFound = captchaData.Captchas.find((element) => {
            if (element.id === interaction.user.id) {
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
                GuildID: interaction.guild.id,
              },
              {
                $addToSet: {
                  Captchas: { id: interaction.user.id, captcha: captcha.text },
                },
              }
            );
          }
          break;
        case "normal-verify-button":
          guild.members.fetch(`${interaction.user.id}`).then(async (user) => {
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
          break;
      }
    }
  },
};
