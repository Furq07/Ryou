const { InteractionType, EmbedBuilder } = require("discord.js");
const captchaDB = require("../../src/models/captchaDB");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, guild, type, fields, member } = interaction;
    if (type !== InteractionType.ModalSubmit || !customId === "CaptchaModal")
      return;
    let captchaData = await captchaDB.findOne({
      GuildID: guild.id,
      MemberID: member.id,
    });
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    const Input = fields.getTextInputValue("CaptchaInput");
    if (Input === captchaData.Code) {
      await captchaDB.findOneAndDelete({
        GuildID: guild.id,
        MemberID: member.id,
      });
      const CommunityRole = guild.roles.cache.find(
        (r) => r.id === setupData.CommunityRoleID
      );
      member.roles.add(CommunityRole);

      interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor("#800000")
            .setTitle("Verification Successful!")
            .setDescription("You have been Verified, go ahead and have fun!"),
        ],
        components: [],
        files: [],
      });
    } else {
      interaction.reply({
        content: "Code was Incorrect, Try Again!",
        ephemeral: true,
      });
    }
  },
};
