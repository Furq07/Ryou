const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isButton()) {
      const { customId, channel, member, message } = interaction;
      if (
        ["Health", "Travel", "Food", "Lifestyle", "Anime"].includes(customId)
      ) {
        const msg = await channel.messages.fetch(message.id);
        const embed = msg.embeds[0];
        const footer = embed.footer.text;
        const filter = footer.match(/(\d+)/);
        if (filter[0] !== member.id) {
          interaction.reply({
            content: `These Buttons aren't for You!`,
            ephemeral: true,
          });
          return;
        }
        const modal = new ModalBuilder()
          .setCustomId(`writeBlog`)
          .setTitle(`Write an Blog!`);

        const textInput = new TextInputBuilder()
          .setCustomId(`writeBlogInput`)
          .setLabel(`Your ${customId} Blog Here!`)
          .setRequired(true)
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder("Write Whatever you want here!");
        modal.addComponents(new ActionRowBuilder().addComponents(textInput));
        await interaction.showModal(modal);
      }
    }
  },
};
