const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
  name: "user-info",
  description: "Get user info",
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "Select user to get its info",
      required: true,
    },
  ],
  async execute(interaction, client) {
    const { options, guild, member } = interaction;
    const user = options.getMember("user");
    interaction.reply({
      embeds: [
        new EmbedBuilder().setColor("#800000").addFields(
          {
            name: "User",
            value: `${user.username}`,
            inline: true,
          },
          {
            name: "ID",
            value: `${user.id}`,
            inline: true,
          },
          {
            name: "Account Creation",
            value: `${user.createdAt}`,
          }
        ),
      ],
    });
  },
};
