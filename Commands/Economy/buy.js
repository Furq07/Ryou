const invDB = require("../../src/models/invDB");
const ecoDB = require("../../src/models/ecoDB");
const { ApplicationCommandOptionType } = require("discord.js");
module.exports = {
  name: "buy",
  description: "Use this command to buy stuff from Shop!",
  category: "Eco",
  options: [
    {
      name: "item",
      description: "Choose what you want to Buy.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Banknote", value: "Banknote" },
        {
          name: "Dart Rifle",
          value: "DartRifle",
        },
        {
          name: "Fishing Rod",
          value: "FishingRod",
        },
        {
          name: "Laptop",
          value: "Laptop",
        },
        { name: "Shovel", value: "Shovel" },
        {
          name: "Tranquilizer Dart",
          value: "TranquilizerDart",
        },
        {
          name: "Phone",
          value: "Phone",
        },
      ],
    },
    {
      name: "quantity",
      description: "Enter the amount of item you wanna Buy!",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],

  async execute(interaction, client) {
    const { options, member } = interaction;
    const item = options.getString("item");
    const quantity = options.getInteger("quantity") || 1;
    const ecoData = await ecoDB.findOne({ MemberID: member.id });
    if (!ecoData) return;
    const costs = [
      { item: "Banknote", cost: 9999, emoji: "💵" },
      {
        item: "DartRifle",
        cost: 3999,
        emoji: "<:DartRifle:1032644289672511568>",
      },
      { item: "FishingRod", cost: 2999, emoji: "🎣" },
      { item: "Laptop", cost: 4750, emoji: "💻" },
      { item: "Shovel", cost: 3250, emoji: "<:shovel:1034130304971063467>" },
      {
        item: "TranquilizerDart",
        cost: 99,
        emoji: "<:TranquilizerDart:1034132988033761423>",
      },
      {
        item: "Phone",
        cost: 3645,
        emoji: "📱",
      },
    ];
    let cost;
    let emoji;
    costs.some((element) => {
      if (element.item === item) {
        cost = element.cost;
        emoji = element.emoji;
      }
    });
    const finalCost = cost * quantity;
    if (finalCost <= ecoData.Cash) {
      await ecoDB.findOneAndUpdate(
        { MemberID: member.id },
        { $inc: { Cash: -finalCost } }
      );
      await invDB.findOneAndUpdate(
        { MemberID: member.id },
        { $inc: { [item]: +quantity } }
      );
      interaction.reply({
        content: `Successfully Purchased ${quantity}x ${emoji} ${item}!`,
      });
    } else {
      interaction.reply({
        content: `You Need ${client.config.ecoIcon}${finalCost} To be able to Purchase ${quantity}x ${emoji} ${item}, Sadly you don't have that!`,
      });
    }
  },
};
