module.exports = {
  name: "ping",
  description: "Ping Pong",

  async execute(interaction) {
    interaction.reply({ content: "Pong", ephemeral: true });
  },
};
