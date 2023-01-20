const {
  PermissionsBitField,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");
const marriageDB = require("../../src/models/marriageDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { command } = interaction;
    if (!interaction.isChatInputCommand()) return;
    if (command === "propose") {
      const marriageData = await marriageDB.findOne({
        userId: interaction.user.id,
      });
      if (!marriageData) {
        new marriageDB({
          userId: interaction.user.id,
        }).save();
      }
    }
  },
};
