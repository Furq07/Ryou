// [-------------------[Imports]-------------------]
const { loadCommands } = require("../../src/Handlers/commandHandler");
const chalk = require("chalk");
const { ActivityType } = require("discord.js");
const cron = require("node-cron");
const setupDB = require("../../src/models/setupDB");
// [-------------------[File Initiation]-------------------]
module.exports = {
  name: "ready",
  async execute(client) {
    const { guilds, user, commands, events } = client;
    // let setupData = await setupDB.findOne({ GuildID: guilds.guild.id });
    // console.log(guilds.guild.id);
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
      channel.send({ content: "testing" });
      // const jtcchannels = setupData.JTCInfo.find((element) => {
      //   return element;
      // });

      // console.log(jtcchannels);
      // var size = Object.keys(userLimitIsFound6.users).length;
      // if (jtcusers) {
      //   for (let i = 0; i < size; i++) {
      //     guild.members
      //       .fetch(`${jtcusers[i].id}`)
      //       .then((user) => {
      //         interaction.guild.channels.cache
      //           .get(`${userLimitIsFound6.channel}`)
      //           .permissionOverwrites.edit(user, {
      //             ViewChannel: true,
      //           });
      //       })
      //       .catch(() => {});
      //   }
      // }
      // cron.schedule("*/1 * * * *", function () {
      //   channel.send({ content: "testing" });
      // });
    });
  },
};
