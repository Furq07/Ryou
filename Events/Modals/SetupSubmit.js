const {
  InteractionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { guild, type, customId, message, channel, fields } = interaction;
    if (type !== InteractionType.ModalSubmit) return;
    const msg = await channel.messages.fetch(message.id);
    const data = msg.components[0];
    const newActionRow = ActionRowBuilder.from(data);
    const setupData = await setupDB.findOne({ GuildID: guild.id });
    if ("VerificationDescModal" === customId) {
      const VerificationDesc = fields.getTextInputValue(
        "VerificationDescInput"
      );
      guild.channels
        .fetch(`${setupData.VerificationChannelID}`)
        .then((channel) => {
          channel.messages
            .fetch(`${setupData.VerificationMessageID}`)
            .then((message) => {
              const Embed = message.embeds[0];
              const editEmbed = EmbedBuilder.from(Embed).setDescription(
                `${VerificationDesc}`
              );
              message.edit({ embeds: [editEmbed] });
            });
        });
      newActionRow.components[1].setStyle(ButtonStyle.Success);
      interaction.update({
        components: [newActionRow],
      });
    } else if ("TicketDescModal" === customId) {
      const TicketDesc = fields.getTextInputValue("TicketDescInput");
      guild.channels.fetch(`${setupData.TicketChannelID}`).then((channel) => {
        channel.messages
          .fetch(`${setupData.TicketMessageID}`)
          .then((message) => {
            const Embed = message.embeds[0];
            message.edit({
              embeds: [
                EmbedBuilder.from(Embed).setDescription(`${TicketDesc}`),
              ],
            });
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("#800000")
                  .setDescription(
                    `Ticket [Description](${message.url}) Have Been Updated!`
                  ),
              ],
              ephemeral: true,
            });
          });
      });
    }
  },
};
