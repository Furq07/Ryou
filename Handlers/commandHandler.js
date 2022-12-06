async function loadCommands(client) {
  const { loadFiles } = require("./fileLoader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Commands", "Status");

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

    table.addRow(command.name, "✅");
  });

  client.application.commands.set(commandsArray);
  return console.log(table.toString(), "\nCommands Loaded.");
}

module.exports = { loadCommands };
