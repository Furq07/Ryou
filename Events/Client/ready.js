// [-------------------[Imports]-------------------]
const { loadCommands } = require("../../src/Handlers/commandHandler");
const chalk = require("chalk");
const { ActivityType } = require("discord.js");
const cron = require("node-cron");
// [-------------------[File Initiation]-------------------]
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    const { guilds, user, commands, events } = client;
    // [-------------------[Status & Presence Initiation]-------------------]
    user.setPresence({
      activities: [
        {
          name: `${guilds.cache.size} Server`,
          type: ActivityType.Watching,
        },
      ],
      status: "dnd",
    });

    // [-------------------[Bot Startup Message]-------------------]
    loadCommands(client)
      .then(
        console.log(
          chalk.gray("Command Initiation:"),
          chalk.green("Successful")
        )
      )
      .catch((err) =>
        console.error(
          chalk.gray("Command Initiation:"),
          chalk.red("Failed"),
          chalk.gray(`\n${err}`)
        )
      );
    console.log(chalk.gray("Connected To"), chalk.yellow(`${user.tag}`));
    client.channels.fetch("1056559754513760276").then(async (channel) => {
      channel.send({content: "testing"})
      cron.schedule("*/1 * * * *", function () {
        channel.send({ content: "testing" });
      });
    });
  },
};
