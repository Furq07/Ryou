const { InteractionType, EmbedBuilder } = require("discord.js");
const ecoDB = require("../../src/models/ecoDB");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, type, fields, member, guild } = interaction;

    if (type == InteractionType.ModalSubmit && customId === "customDeposit") {
      let ecoData = await ecoDB.findOne({ MemberID: member.id });
      const embed = new EmbedBuilder()
        .setColor("#800000")
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setFooter({
          text: "Ryou - Economy",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });

      const amount = fields.getTextInputValue("customDepositInput");
      const input = parseInt(amount);

      if (isNaN(amount))
        return interaction.reply({
          content:
            "Please Enter an Correct Amount, Make sure its only Numbers.",
        });
      if (input > ecoData.Cash)
        return interaction.reply({
          embeds: [
            embed
              .setDescription("You Don't have that Much Yur!")
              .setTitle("Whoopsi"),
          ],
        });

      const limit = ecoData.Banklimit - ecoData.Bank;
      if (limit > input) {
        await ecoDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Bank: +input, Cash: -input } }
        );
        interaction.reply({
          embeds: [
            embed
              .setFields(
                {
                  name: "Deposited",
                  value: `<:Yur:1034414003071500320>\`${input}\``,
                  inline: true,
                },
                {
                  name: "Current Cash:",
                  value: `<:Yur:1034414003071500320>\`${
                    ecoData.Cash - input
                  }\``,
                  inline: true,
                },
                {
                  name: "Current Bank:",
                  value: `<:Yur:1034414003071500320>\`${
                    ecoData.Bank + input
                  }\``,
                  inline: true,
                }
              )
              .setTitle("__Deposit Successful__"),
          ],
        });
      } else {
        const finalCash = input - limit;
        const finalAmount = finalCash - input;
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
                  value: `<:Yur:1034414003071500320>\`${input}\``,
                  inline: true,
                },
                {
                  name: "Current Cash:",
                  value: `<:Yur:1034414003071500320>\`${
                    ecoData.Cash - input
                  }\``,
                  inline: true,
                },
                {
                  name: "Current Bank:",
                  value: `<:Yur:1034414003071500320>\`${
                    ecoData.Bank + input
                  }\``,
                  inline: true,
                }
              )
              .setTitle("__Deposit Successful__"),
          ],
        });
      }
    }
  },
};
