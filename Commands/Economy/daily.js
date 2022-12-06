const { EmbedBuilder } = require("discord.js");
const ecoDB = require("../../src/models/ecoDB");

module.exports = {
  name: "daily",
  cooldown: 86400,
  description: "Everyday get some Daily Reward",
  category: "Eco",
  async execute(interaction, client) {
    const { guild, member } = interaction;
    const randomCash = Math.floor(Math.random() * 1000) + 500;
    const randomRuby = Math.floor(Math.random() * 5) + 1;
    const dailyEmbed = new EmbedBuilder()
      .setTitle("Daily Rewards!")
      .setDescription("Here is Your Daily Reward!")
      .setFooter({
        text: "Ryou - Economy",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(guild.iconURL({ dynamic: true }));

    await ecoDB.findOneAndUpdate(
      { MemberID: member.id },
      { $inc: { Cash: +randomCash, Ruby: +randomRuby } }
    );

    interaction.reply({
      embeds: [
        dailyEmbed.setFields(
          {
            name: "Cash:",
            value: `${client.config.ecoIcon}\`${randomCash}\``,
            inline: true,
          },
          {
            name: "Ruby:",
            value: `${client.config.ecoRuby}\`${randomRuby}\``,
            inline: true,
          }
        ),
      ],
    });
  },
};
