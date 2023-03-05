module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { options, commandName } = interaction;
    if (interaction.isAutocomplete()) {
      if (commandName === "sell") {
        const focusedValue = options.getFocused();
        const choices = [
          "Boar",
          "Bug",
          "Beetle",
          "Chicken",
          "Cricket",
          "Cow",
          "Dolphin",
          "Dove",
          "Duck",
          "Dodo",
          "Fish",
          "Fossil",
          "Fox",
          "Garbage",
          "Lobster",
          "Octopus",
          "Panda",
          "PufferFish",
          "Seal",
          "Shrimp",
          "Squid",
          "Swan",
          "Treasure",
          "Turkey",
          "TropicalFish",
          "Vaquita",
          "Worm",
        ];
        const filtered = choices.filter((choice) =>
          choice.startsWith(focusedValue)
        );
        await interaction.respond(
          filtered
            .map((choice) => ({ name: choice, value: choice }))
            .slice(0, 24)
        );
      }
    }
  },
};
