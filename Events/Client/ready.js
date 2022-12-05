const { loadCommands } = require("../../Handlers/commandHandler");
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Client is logged in!`);
    loadCommands(client);
  },
};
