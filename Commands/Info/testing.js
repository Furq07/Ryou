const { EmbedBuilder } = require("discord.js");
const cron = require("node-cron");
module.exports = {
  name: "testing",
  description: "testing purposes",
  async execute(interaction, client) {
    interaction.channel.send({ content: "testing" });

  },
};
