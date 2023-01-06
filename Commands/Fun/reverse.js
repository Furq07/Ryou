const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
  name: "reverse",
  description: "Reverse someting",
  options: [
    {
      name: "text",
      description: "Enther the text what you want to reverse",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async execute(interaction, client) {
    function reverseString(str) {
      let newString = "";
      for (let i = str.length - 1; i >= 0; i--) {
        newString += str[i];
      }
      return newString;
    }
    interaction.reply({
      content: `Reverse form of your given text is: \`${reverseString(
        interaction.options.getString("text")
      )}\``,
    });
  },
};
