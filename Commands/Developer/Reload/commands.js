const { loadCommands } = require("../../../Handlers/commandHandler");
module.exports = {
  subCommand: "reload.commands",
  execute(interaction, client) {
    loadCommands(client);
    interaction.reply({ content: "Reloaded Commands", ephemeral: true });
  },
};
