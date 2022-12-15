const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  name: "ticket-setup",
  description: "Don't hesitate just do it",
  options: [],
  async execute(interaction, client) {
    const { guild, channel } = interaction;
    const modal = new ModalBuilder()
      .setCustomId("Info")
      .setTitle("Enter Description of Embed!");
    const Description = new TextInputBuilder()
      .setCustomId("Desc")
      .setLabel("What to Write in the Ticket Embed?")
      .setValue(
        `Hey, this is an Ticket System,
use the Button Below to create an Ticket!`
      )
      .setRequired(true)
      .setPlaceholder(
        `Hey, this is an Ticket System,
use the Button Below to create an Ticket!`
      )
      .setStyle(TextInputStyle.Paragraph);
    const firstActionRow = new ActionRowBuilder().addComponents(Description);
    modal.addComponents(firstActionRow);
    await interaction.showModal(modal);
    const filter = (i) => i.customId === "Info";
    interaction.awaitModalSubmit({ filter, time: 300000 }).then((i) => {
      const Desc = i.fields.getTextInputValue("Desc");
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${guild.name} | Ticket System`,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setDescription(`${Desc}`)
        .setColor("DarkRed")
        .setFooter({
          text: `Ryou - Ticket System`,
          iconURL: client.user.displayAvatarURL(),
        });
      const Buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("TicketButton")
          .setLabel("Click to make Ticket!")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🎫")
      );

      channel.send({ embeds: [embed], components: [Buttons] });

      i.reply({
        content: "An Setup Ticket Message have been Send!",
        ephemeral: true,
      });
    });
  },
};
