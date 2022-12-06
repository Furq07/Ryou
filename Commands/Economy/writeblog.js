const {
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const invDB = require("../../src/models/invDB");
module.exports = {
  name: "writeblog",
  description: "Write Blogs to earn some Yur!",
  cooldown: 600,
  category: "Eco",
  async execute(interaction, client) {
    const { member, guild, channel } = interaction;
    const invData = await invDB.findOne({ MemberID: member.id });
    const embed = new EmbedBuilder()
      .setTitle("WorkPlace")
      .setColor("#800000")
      .setFooter({
        text: "Ryou - Economy",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(guild.iconURL({ dynamic: true }));
    if (invData.Laptop == undefined || invData.Laptop <= 0)
      return interaction.reply({
        embeds: [
          embed.setDescription(
            "I don't think you have an Laptop yet... where exactly you gonna write it on? 🤔"
          ),
        ],
      });
    const Buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("Health")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Health Blog"),
      new ButtonBuilder()
        .setCustomId("Travel")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Travel Blog"),
      new ButtonBuilder()
        .setCustomId("Food")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Food Blog"),
      new ButtonBuilder()
        .setCustomId("Lifestyle")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Lifestyle Blog"),
      new ButtonBuilder()
        .setCustomId("Anime")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Anime Blog")
    );
    interaction.reply({
      embeds: [
        embed
          .setTitle(`${member.user.username}'s Blogging Page`)
          .setDescription("So, What do you want to Write about?")
          .setFooter({
            text: `Ryou - Economy | ${member.id}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          }),
      ],
      components: [Buttons],
    });
  },
};
