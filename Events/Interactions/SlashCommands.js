module.exports = {
  name: "interactionCreate",
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd)
      return interaction.reply({
        content: "This command is outdated!",
        ephemeral: true,
      });

    if (
      cmd.dev &&
      !["579382548258357419", "564103070334844960"].includes(
        interaction.user.id
      )
    )
      return interaction.reply({
        content: "This is an Developer Only Command!",
      });
    const subCommand = interaction.options.getSubcommand();
    if (subCommand) {
      const subCommandFile = client.subCommands.get(
        `${interaction.commandName}.${subCommand}`
      );
      if (!subCommandFile)
        return interaction.reply({
          content: "This sub-command is outdated!",
          ephemeral: true,
        });
      subCommandFile.execute(interaction, client);
    } else cmd.execute(interaction, client);
  },
};
