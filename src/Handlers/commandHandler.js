async function loadCommands(client) {
  const { loadFiles } = require("./fileLoader");
  await client.commands.clear();
  await client.subCommands.clear();

  let commandsArray = [];

  const Files = await loadFiles("Commands");

  Files.forEach((file) => {
    const command = require(file);

    if (command.subCommand)
      return client.subCommands.set(command.subCommand, command);

    client.commands.set(command.name, command);

    commandsArray.push(command);
  });

  client.application.commands.set(commandsArray);
}

module.exports = { loadCommands };
