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
  name: "deposit",
  description: "Deposit your Yur in the Bank.",
  category: "Eco",
  options: [
    {
      name: "amount",
      description: "Enter the amount of cash you wanna deposit.",
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
      const limit = ecoData.Banklimit - ecoData.Bank;
      const cash = ecoData.Cash;
      if (cash <= 0)
        return interaction.reply({
          embeds: [
            embed.setDescription("You Broke Dude :skull:").setTitle("Whoopsi"),
          ],
        });
      if (limit >= cash) {
        await ecoDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Bank: +cash, Cash: -cash } }
        );
        interaction.reply({
          embeds: [
            embed
              .setFields(
                {
                  name: "Deposited",
                  value: `${client.config.ecoIcon}\`${cash}\``,
                  inline: true,
                },
                {
                  name: "Current Cash:",
                  value: `${client.config.ecoIcon}\`${ecoData.Cash - cash}\``,
                  inline: true,
                },
                {
                  name: "Current Bank:",
                  value: `${client.config.ecoIcon}\`${ecoData.Bank + cash}\``,
                  inline: true,
                }
              )
              .setTitle("__Deposit Successful__"),
          ],
        });
      } else {
        const finalCash = ecoData.Cash - limit;
        const finalAmount = finalCash - ecoData.Cash;
        const cash = Math.abs(finalAmount);
        await ecoDB.findOneAndUpdate(
          { userId: member.user.id },
          { $inc: { Bank: +cash, Cash: -cash } }
        );
        interaction.reply({
          embeds: [
            embed
              .setFields(
                {
                  name: "Deposited",
                  value: `${client.config.ecoIcon}\`${cash}\``,
                  inline: true,
                },
                {
                  name: "Current Cash:",
                  value: `${client.config.ecoIcon}\`${ecoData.Cash - cash}\``,
                  inline: true,
                },
                {
                  name: "Current Bank:",
                  value: `${client.config.ecoIcon}\`${ecoData.Bank + cash}\``,
                  inline: true,
                }
              )
              .setTitle("__Deposit Successful__"),
          ],
        });
      }
    } else {
      const modal = new ModalBuilder()
        .setCustomId(`customDeposit`)
        .setTitle(`Provide an Amount!`);

      const textInput = new TextInputBuilder()
        .setCustomId(`customDepositInput`)
        .setLabel(`What is the Amount you want to Deposit?`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Enter Amount Here!");
      modal.addComponents(new ActionRowBuilder().addComponents(textInput));
      await interaction.showModal(modal);
    }
  },
};
