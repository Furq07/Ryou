const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const marriageDB = require("../../src/models/marriageDB");
module.exports = {
  name: "propose",
  description: "Propose your love",
  options: [
    {
      name: "partner",
      description: "Enter your love",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],
  async execute(interaction, client) {
    const marriageData = await marriageDB.findOne({
      userId: interaction.user.id,
    });
    if (!marriageData) {
      new marriageDB({
        userId: interaction.user.id,
      }).save();
    }
  },
};
