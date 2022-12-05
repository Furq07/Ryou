module.exports = {
  name: "ping",
  description: "Ping Pong",

  execute(interaction) {
    interaction.reply({ content: "Pong", ephemeral: true });
  },
};
