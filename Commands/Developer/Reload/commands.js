const { loadCommands } = require("../../../src/Handlers/commandHandler");
module.exports = {
  subCommand: "reload.commands",
  async execute(interaction, client) {
    loadCommands(client);
    interaction.reply({ content: "Reloaded Commands", ephemeral: true });
  },
};
