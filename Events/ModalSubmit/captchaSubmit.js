const {
  InteractionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const captchaDB = require("../../src/models/captchaDB");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, guild, type, fields } = interaction;
    let captchaData = await captchaDB.findOne({ GuildID: guild.id });
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    if (type == InteractionType.ModalSubmit && customId === "captcha-modal") {
      const captchaVerifyInput = fields.getTextInputValue(
        "captcha-verify-input"
      );
      const captchaFound = captchaData.Captchas.find((element) => {
        if (element.id === interaction.user.id) {
          return element;
        }
      });
      if (captchaVerifyInput === captchaFound.captcha) {
        await captchaDB.updateOne(
          {
            GuildID: interaction.guild.id,
            "Captchas.id": interaction.user.id,
          },
          {
            $set: {
              "Captchas.$.verified": true,
            },
          }
        );
        guild.members.fetch(`${captchaFound.id}`).then(async (user) => {
          const CommunityRole = guild.roles.cache.find(
            (r) => r.id === `${setupData.CommunityRoleID}`
          );
          user.roles.add(CommunityRole);
        });
        interaction.update({
          content: "✅ Successfully verified",
          components: [],
          files: [],
        });
      } else {
        interaction.update({ content: "Failed, try again" });
      }
    }
  },
};
