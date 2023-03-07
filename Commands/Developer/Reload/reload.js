const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "reload",
  description: "Reloads commands/events!",
  dev: true,
  options: [
    {
      name: "events",
      description: "Reloads Events",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "commands",
      description: "Reloads Commands",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
};
