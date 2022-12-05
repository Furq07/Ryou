const {
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "reload",
  description: "Reloads commands/events!",
  userPermissions: [PermissionsBitField.Flags.Administrator],
  dev: true,
  options: [
    {
      name: "events",
      description: "Reloads Events",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "commands",
      description: "Reloads Events",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
};
