const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  TextInputStyle,
  TextInputBuilder,
  ModalBuilder,
  ActionRowBuilder,
} = require("discord.js");
const ecoDB = require("../../src/models/ecoDB");

module.exports = {
  name: "withdraw",
  description: "Withdraw your Yur from the Bank.",
  category: "Eco",
  options: [
    {
      name: "amount",
      description: "Enter the amount of cash you wanna withdraw.",
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "Max", value: "max" },
        { name: "Custom", value: "custom" },
      ],
      required: true,
    },
  ],
  async execute(interaction, client) {
    const { member, guild, options } = interaction;
    const amount = options.getString("amount");
    let ecoData = await ecoDB.findOne({ MemberID: member.id });
    if (!ecoData) return;
    const embed = new EmbedBuilder()
      .setColor("#800000")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({
        text: "Ryou - Economy",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    if (amount === "max") {
      const bank = ecoData.Bank;
      if (bank <= 0)
        return interaction.reply({
          embeds: [
            embed
              .setDescription("You got Nothing in Bank Bro :skull:")
              .setTitle("Whoopsi"),
          ],
        });
      await ecoDB.findOneAndUpdate(
        { MemberID: member.id },
        { $inc: { Bank: -bank, Cash: +bank } }
      );
      interaction.reply({
        embeds: [
          embed
            .setFields(
              {
                name: "Withdrawn:",
                value: `${client.config.ecoIcon}\`${bank}\``,
                inline: true,
              },
              {
                name: "Current Cash:",
                value: `${client.config.ecoIcon}\`${ecoData.Cash + bank}\``,
                inline: true,
              },
              {
                name: "Current Bank:",
                value: `${client.config.ecoIcon}\`${ecoData.Bank - bank}\``,
                inline: true,
              }
            )
            .setTitle("__Withdrawal Successful__"),
        ],
      });
    } else {
      const modal = new ModalBuilder()
        .setCustomId(`customWithdraw`)
        .setTitle(`Provide an Amount!`);

      const textInput = new TextInputBuilder()
        .setCustomId(`customWithdrawInput`)
        .setLabel(`What is the Amount you want to Withdraw?`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Enter Amount Here!");
      modal.addComponents(new ActionRowBuilder().addComponents(textInput));
      await interaction.showModal(modal);
    }
  },
};
