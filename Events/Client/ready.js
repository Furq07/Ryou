// [-------------------[Imports]-------------------]
const { loadCommands } = require("../../Handlers/commandHandler");
const chalk = require("chalk");
const { ActivityType } = require("discord.js");
const { version: discordjsVersion } = require("discord.js");
// [-------------------[File Initiation]-------------------]
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    const { guilds, user, commands } = client;
    loadCommands(client);
    // [-------------------[Status & Presence Initiation]-------------------]
    user.setPresence({
      activities: [
        {
          name: `${guilds.cache.size} Servers`,
          type: ActivityType.Watching,
        },
      ],
      status: "dnd",
    });

    // [-------------------[Bot Startup Message]-------------------]
    const supportServer = guilds.cache.get(`1006970377500622860`);
    console.log("————————————————————————————————");
    console.log(chalk.green.bold("Success!"));
    console.log(chalk.gray("Connected To"), chalk.yellow(`${user.tag}`));
    console.log(chalk.gray("Connected To"), chalk.yellow(`MongoDB`));
    console.log(
      chalk.white("Watching"),
      chalk.red(`${guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`),
      chalk.white(
        `${
          guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1
            ? "Users,"
            : "User,"
        }`
      ),
      chalk.red(`${guilds.cache.size}`),
      chalk.white(`${guilds.cache.size > 1 ? "Servers." : "Server."}`)
    );
    console.log(
      chalk.white(`Prefix:` + chalk.red(` /`)),
      chalk.white("||"),
      chalk.red(`${commands.size}`),
      chalk.white(`Commands`)
    );
    console.log(
      chalk.white(`Support Server: `) +
        chalk.red(`${supportServer.name || "None"}`)
    );
    console.log(chalk.red.bold("——————————[Statistics]——————————"));
    console.log(
      chalk.gray(
        `Discord.js Version: ${discordjsVersion}\nRunning on Node ${process.version} on ${process.platform} ${process.arch}`
      )
    );
    console.log(
      chalk.gray(
        `Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(
          2
        )} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        )} MB`
      )
    );
    console.log("————————————————————————————————");
  },
};
