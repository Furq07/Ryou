const { InteractionType, EmbedBuilder } = require("discord.js");
const ecoDB = require("../../src/models/ecoDB");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, type, fields, member, guild } = interaction;

    if (type == InteractionType.ModalSubmit && customId === "customWithdraw") {
      let ecoData = await ecoDB.findOne({ MemberID: member.id });
      const embed = new EmbedBuilder()
        .setColor("#800000")
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setFooter({
          text: "Ryou - Economy",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });

      const amount = fields.getTextInputValue("customWithdrawInput");
      const input = parseInt(amount);

      if (isNaN(amount))
        return interaction.reply({
          content:
            "Please Enter an Correct Amount, Make sure its only Numbers.",
        });
      if (input > ecoData.Bank)
        return interaction.reply({
          embeds: [
            embed
              .setDescription(
                "You Don't have that Much Yur in your Bank Account!"
              )
              .setTitle("Whoopsi"),
          ],
        });
      await ecoDB.findOneAndUpdate(
        { MemberID: member.id },
        { $inc: { Bank: -input, Cash: +input } }
      );
      interaction.reply({
        embeds: [
          embed
            .setFields(
              {
                name: "Withdrawn:",
                value: `<:Yur:1034414003071500320>\`${input}\``,
                inline: true,
              },
              {
                name: "Current Cash:",
                value: `<:Yur:1034414003071500320>\`${ecoData.Cash + input}\``,
                inline: true,
              },
              {
                name: "Current Bank:",
                value: `<:Yur:1034414003071500320>\`${ecoData.Bank - input}\``,
                inline: true,
              }
            )
            .setTitle("__Withdrawal Successful__"),
        ],
      });
    }
  },
};
