const { loadEvents } = require("../../../src/Handlers/eventHandler");
module.exports = {
  subCommand: "reload.events",
  async execute(interaction, client) {
    for (const [key, value] of client.events)
      client.removeListener(`${key}`, value, true);
    loadEvents(client);
    interaction.reply({ content: "Reloaded Events", ephemeral: true });
  },
};
