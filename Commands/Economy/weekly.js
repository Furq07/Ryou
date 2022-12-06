const { EmbedBuilder } = require("discord.js");
const ecoDB = require("../../src/models/ecoDB");

module.exports = {
  name: "weekly",
  cooldown: 604800,
  category: "Eco",
  description: "Every Week get some Extra Rewards!",
  async execute(interaction, client) {
    const { guild, member } = interaction;
    const randomCash = Math.floor(Math.random() * 8000) + 4000;
    const randomRuby = Math.floor(Math.random() * 10) + 5;
    const weeklyEmbed = new EmbedBuilder()
      .setTitle("Weekly Rewards!")
      .setDescription("Here is Your Weekly Reward!")
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
        weeklyEmbed.setFields(
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
