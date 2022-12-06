const { EmbedBuilder } = require("discord.js");
const ecoDB = require("../../src/models/ecoDB");
module.exports = {
  name: "balance",
  description: "Check Your or Someone else's Yur!",
  cooldown: 5,
  category: "Eco",
  async execute(interaction, client) {
    const { member } = interaction;
    let ecoData = await ecoDB.findOne({ MemberID: member.id });
    if (!ecoData) return;
    const embed = new EmbedBuilder()
      .setTitle(`${member.user.tag}'s Balance!`)
      .setColor("#800000")
      .setDescription(
        `
      💵 **Cash:** ${client.config.ecoIcon}\`${ecoData.Cash}\`
      🏦 **Bank:** ${client.config.ecoIcon}\`${ecoData.Bank}\` / \`${
          ecoData.Banklimit
        }\`
      💎 **Ruby:** ${client.config.ecoRuby}\`${ecoData.Ruby}\`
      🌐 **NetWorth:** ${client.config.ecoIcon}\`${
          ecoData.Ruby * 20 + ecoData.Bank + ecoData.Cash
        }\``
      )

      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Economy",
      });

    interaction.reply({ embeds: [embed] });
  },
};
