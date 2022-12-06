const invDB = require("../../src/models/invDB");
const ecoDB = require("../../src/models/ecoDB");
const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
module.exports = {
  name: "sell",
  description: "Use this command to sell items",
  category: "Eco",
  options: [
    {
      name: "item",
      description: "Choose what you want to Buy.",
      autocomplete: true,
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "quantity",
      description:
        "Enter the amount of item you wanna Sell, You can also put max to sell all of them!",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  async execute(interaction, client) {
    const { options, member, guild, channel } = interaction;
    const item = options.getString("item");
    const amount = options.getString("quantity") || 1;
    const ecoData = await ecoDB.findOne({ MemberID: member.id });
    const invData = await invDB.findOne({ MemberID: member.id });
    if (!ecoData) return;
    const values = [
      { item: "Boar", value: 145, emoji: "🐗" },
      { item: "Bug", value: 55, emoji: "🐛" },
      { item: "Beetle", value: 75, emoji: "🪲" },
      { item: "Chicken", value: 85, emoji: "🐔" },
      { item: "Cricket", value: 65, emoji: "🦗" },
      { item: "Cow", value: 175, emoji: "🐄" },
      { item: "Dolphin", value: 175, emoji: "🐬" },
      { item: "Dove", value: 125, emoji: "🕊️" },
      { item: "Duck", value: 85, emoji: "🦆" },
      { item: "Dodo", value: 875, emoji: "🦤" },
      { item: "Fish", value: 120, emoji: "🐟" },
      { item: "Fossil", value: 755, emoji: "<:Fossil:1032699142599884871>" },
      { item: "Fox", value: 125, emoji: "🦊" },
      { item: "Garbage", value: 35, emoji: "🗑️" },
      { item: "Lobster", value: 135, emoji: "🦞" },
      { item: "Octopus", value: 195, emoji: "🐙" },
      { item: "Panda", value: 225, emoji: "🐼" },
      { item: "PufferFish", value: 125, emoji: "🐡" },
      { item: "Seal", value: 185, emoji: "🦭" },
      { item: "Shrimp", value: 115, emoji: "🦐" },
      { item: "Squid", value: 155, emoji: "🦑" },
      { item: "Swan", value: 145, emoji: "🦢" },
      { item: "Treasure", value: 345, emoji: "🪙" },
      { item: "Turkey", value: 235, emoji: "🦃" },
      { item: "TropicalFish", value: 95, emoji: "🐠" },
      { item: "Vaquita", value: 850, emoji: "<:Vaquita:1032632410615062538>" },
      { item: "Worm", value: 25, emoji: "🪱" },
    ];
    if (item) {
      let value;
      let emoji;
      values.some((element) => {
        if (element.item === item) {
          value = element.value;
          emoji = element.emoji;
        }
      });

      if (!invData[item])
        return interaction.reply({
          content: `You don't have any ${emoji} ${item}`,
        });
      if (amount > invData[item])
        return interaction.reply({
          content: `You don't have ${amount}x ${emoji} ${item}`,
        });
      let quantity = amount;
      if (amount.toLowerCase() === "max") quantity = invData[item];
      const finalValue = value * quantity;
      await ecoDB.findOneAndUpdate(
        { MemberID: member.id },
        { $inc: { Cash: +finalValue } }
      );
      await invDB.findOneAndUpdate(
        { MemberID: member.id },
        { $inc: { [item]: -quantity } }
      );
      interaction.reply({
        content: `Successfully Sold ${quantity}x ${emoji} ${item}`,
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Confirmation Required!")
        .setColor("#800000")
        .setDescription("Do you wanna sell all your Sellable items?")
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setFooter({
          text: "Ryou - Economy",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });
      const collector = channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 30000,
      });
      const Buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("Yes")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("No")
          .setLabel("No")
          .setStyle(ButtonStyle.Danger)
      );
      await interaction.deferReply();
      for (element of values) {
        const Item = element.item;
        if (invData[Item] && invData[Item] >= 0) {
          const finalValue = element.value * invData[Item];
          await embed.addFields({
            name: `${invData[Item]}x ${element.emoji} ${Item}`,
            value: `${client.config.ecoIcon}\`${finalValue}\``,
          });
        }
      }
      if (!embed.data.fields)
        return interaction.editReply({
          embeds: [
            embed
              .setTitle("Whoopsi")
              .setDescription("I don't think you have any Sellable Items"),
          ],
        });

      const M = await interaction.editReply({
        embeds: [embed],
        components: [Buttons],
      });

      collector.on("collect", async (collected) => {
        if (collected.member.id != member.id)
          return collected.reply({
            content: `These Buttons aren't for You!`,
            ephemeral: true,
          });
        if (collected.customId === "Yes") {
          for (element of values) {
            const Item = element.item;
            if (invData[Item] && invData[Item] >= 0) {
              const finalValue = element.value * invData[Item];
              await invDB.findOneAndUpdate(
                { MemberID: member.id },
                { [Item]: 0 }
              );
              await ecoDB.findOneAndUpdate(
                { MemberID: member.id },
                { $inc: { Cash: +finalValue } }
              );
            }
          }
          M.edit({
            embeds: [
              embed
                .setTitle("Confirmation Complete")
                .setDescription("Your Items have been sold!"),
            ],
            components: [],
          });
        } else if (collected.customId === "No") {
          M.edit({
            embeds: [
              embed
                .setTitle("Confirmation Denied")
                .setDescription("Looks like you don't wanna sell..."),
            ],
            components: [],
          });
        }
      });
      collector.on("end", () => {
        M.edit({
          embeds: [
            embed
              .setTitle("Timed Out!")
              .setDescription("Looks like Time is Out!"),
          ],
          components: [],
        });
      });
    }
  },
};
