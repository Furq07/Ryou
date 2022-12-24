const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "test",
  description: "test",

  async execute(interaction) {
    interaction.reply({ content: "done", ephemeral: true });
  },
};
