const {
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const invDB = require("../../src/models/invDB");
module.exports = {
  name: "inventory",
  description: "Check your inventory for items",
  category: "Eco",
  async execute(interaction, client) {
    const { member, guild, channel } = interaction;
    const invData = await invDB.findOne({ MemberID: member.id });
    const collector = channel.createMessageComponentCollector({
      componentType: ComponentType.SelectMenu,
      time: 90000,
    });
    const selectMenu = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("inventory")
        .setPlaceholder("Choose Category Here!")
        .setMinValues(1)
        .setMaxValues(2)
        .addOptions(
          { label: "All", value: "all" },
          {
            label: "Tools",
            value: "tools",
          },
          {
            label: "Power Ups",
            value: "powerups",
          },
          { label: "Sellable", value: "sellable" }
        )
    );
    const embed = new EmbedBuilder()
      .setColor("#800000")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`${member.user.username}'s Inventory`)
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Economy",
      });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#800000")
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .setTitle(`${member.user.username}'s Inventory`)
          .setFooter({
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
            text: "Ryou - Economy",
          })
          .setDescription(`Select Below, on what you are Checking on!`),
      ],
      components: [selectMenu],
    });

    collector.on("collect", async (collected) => {
      if (["inventory"].includes(collected.customId)) {
        let value = collected.values;
        await embed.setFields();
        if (value.includes("all")) value = ["tools", "powerups", "sellable"];
        if (value.includes("tools")) {
          const values = [
            { item: "Shovel", emoji: "<:shovel:1034130304971063467>" },
            { item: "DartRifle", emoji: "<:DartRifle:1032644289672511568>" },
            { item: "Laptop", emoji: "💻" },
            { item: "FishingRod", emoji: "🎣" },
            {
              item: "TranquilizerDart",
              emoji: "<:TranquilizerDart:1034132988033761423>",
            },
          ];
          for (element of values) {
            const item = element.item;
            if (invData[item] && invData[item] >= 0) {
              embed.addFields({
                name: `${element.emoji} \`${item}\``,
                value: `**\`Amount: ${invData[item]}\`**`,
              });
            }
          }
        }
        if (value.includes("powerups")) {
          const values = [{ item: "Banknote", emoji: "💵" }];
          for (element of values) {
            const item = element.item;
            if (invData[item] && invData[item] >= 0) {
              embed.addFields({
                name: `${element.emoji} \`${item}\``,
                value: `**\`Amount: ${invData[item]}\`**`,
              });
            }
          }
        }
        if (value.includes("sellable")) {
          const values = [
            { item: "Boar", emoji: "🐗" },
            { item: "Bug", emoji: "🐛" },
            { item: "Beetle", emoji: "🪲" },
            { item: "Chicken", emoji: "🐔" },
            { item: "Cricket", emoji: "🦗" },
            { item: "Cow", emoji: "🐄" },
            { item: "Dolphin", emoji: "🐬" },
            { item: "Dove", emoji: "🕊️" },
            { item: "Duck", emoji: "🦆" },
            { item: "Dodo", emoji: "🦤" },
            { item: "Fish", emoji: "🐟" },
            {
              item: "Fossil",

              emoji: "<:Fossil:1032699142599884871>",
            },
            { item: "Fox", emoji: "🦊" },
            { item: "Garbage", emoji: "🗑️" },
            { item: "Lobster", emoji: "🦞" },
            { item: "Octopus", emoji: "🐙" },
            { item: "Panda", emoji: "🐼" },
            { item: "PufferFish", emoji: "🐡" },
            { item: "Seal", emoji: "🦭" },
            { item: "Shrimp", emoji: "🦐" },
            { item: "Squid", emoji: "🦑" },
            { item: "Swan", emoji: "🦢" },
            { item: "Treasure", emoji: "🪙" },
            { item: "Turkey", emoji: "🦃" },
            { item: "TropicalFish", emoji: "🐠" },
            {
              item: "Vaquita",

              emoji: "<:Vaquita:1032632410615062538>",
            },
            { item: "Worm", emoji: "🪱" },
          ];
          for (element of values) {
            const item = element.item;
            if (invData[item] && invData[item] >= 0) {
              embed.addFields({
                name: `${element.emoji} \`${item}\``,
                value: `**\`Amount: ${invData[item]}\`**`,
              });
            }
          }
        }
        if (embed.data.fields <= 0) {
          embed.addFields({
            name: "I don't think you have anything here!",
            value: "⠀",
          });
        }
        collected.update({ embeds: [embed] });
      }
    });
    collector.on("end", () => {
      interaction.editReply({
        embeds: [
          embed.setFields().setTitle("Timed Out!")
            .setDescription(`If you want to use this **command** again,
          **Try Using:** </inventory:1034079647299817552>!`),
        ],
        components: [],
      });
    });
  },
};
