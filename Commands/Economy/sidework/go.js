const { ApplicationCommandOptionType } = require("discord.js");
module.exports = {
  name: "go",
  description: "Work side jobs to do random stuff to earn some Yur!",
  category: "Eco",
  options: [
    {
      name: "hunting",
      description: "Hunt some animals, sell them & earn some yur",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "fishing",
      description: "catch some fish, sell them & earn some yur",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "digging",
      description: "dig the earth to find some wild stuff.",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
};
