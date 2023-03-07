const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  AttachmentBuilder,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const { Captcha } = require("captcha-canvas");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { guild, member, customId } = interaction;
    if (!interaction.isButton() || customId !== "VerifyButton") return;
    let setupData = await setupDB.findOne({ GuildID: guild.id });
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
    }
  },
};
