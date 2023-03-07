const { loadFiles } = require("./fileLoader");

async function loadEvents(client) {
  client.events = new Map();
  const files = await loadFiles("Events");
  for (const file of files) {
    const event = require(file);
    const execute = (...args) => event.execute(...args, client);
    const target = event.rest ? client.rest : client;
    target[event.once ? "once" : "on"](event.name, execute);
    client.events.set(event.name, execute);
  }
}
module.exports = { loadEvents };
