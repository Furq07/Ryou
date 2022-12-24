const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
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
              .setDimension(150, 450)
              .setDecoy({ opacity: 0.5 })
              .setTrace({ color: "gray" })
              .setCaptcha({
                text: `${captchaFound.captcha}`,
                color: "black",
                size: 60,
              });
            const buffer1 = captcha1.generateSync();
            interaction.reply({
              ephemeral: true,
              content: `You had already generated your captcha, just verify this time`,
              files: [
                {
                  attachment: buffer1,
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
          } else {
            function generateWord() {
              const alphabet = "abcdefghijklmnopqrstuvwxyz";
              const numbers = "0123456789";
              let word = "";
              for (let i = 0; i < 5; i++) {
                if (Math.random() < 0.5) {
                  word += alphabet.charAt(
                    Math.floor(Math.random() * alphabet.length)
                  );
                } else {
                  word += numbers.charAt(
                    Math.floor(Math.random() * numbers.length)
                  );
                }
              }
              return word;
            }

            const captcha = new CaptchaGenerator()
              .setDimension(150, 450)
              .setDecoy({ opacity: 0.5 })
              .setTrace({ color: "gray" })
              .setCaptcha({
                text: `${generateWord()}`,
                color: "black",
                size: 60,
              });
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
              content: "✅ Successfully verified",
              ephemeral: true,
            });
          });
          break;
      }
    }
  },
};
