const {
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const invDB = require("../../src/models/invDB");
module.exports = {
  name: "shop",
  description: "Open Shop to checkout what you need.",
  category: "Eco",
  async execute(interaction, client) {
    const { member, guild, channel } = interaction;
    const invData = await invDB.findOne({ MemberID: member.id });
    const collector = channel.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 60000,
    });
    const selectMenu = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("shop")
        .setPlaceholder("Choose Category Here!")
        .setMinValues(1)
        .setMaxValues(3)
        .addOptions(
          { label: "All", value: "all" },
          {
            label: "Tools",
            value: "tools",
          },
          {
            label: "Power Ups",
            value: "powerups",
          }
        )
    );
    const embed = new EmbedBuilder()
      .setColor("#800000")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setTitle("Shop Menu")
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Economy",
      });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#800000")
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .setTitle("Shop Menu")
          .setFooter({
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
            text: "Ryou - Economy",
          })
          .setDescription(
            `Welcome to the Shop Menu!
    In Here you can check all types of item you can buy!
    select an Category from down below!`
          ),
      ],
      components: [selectMenu],
    });

    collector.on("collect", async (collected) => {
      if (["shop"].includes(collected.customId)) {
        let value = collected.values;
        await embed.setFields();
        if (value.includes("all")) value = ["tools", "powerups"];
        if (value.includes("tools")) {
          await embed.addFields(
            {
              name: `<:DartRifle:1032644289672511568> Dart Rifle *(${
                invData.DartRifle || `0`
              })* - ${client.config.ecoIcon}\`3999\``,
              value: "Can use it to hunt some Animal from the Forest",
            },
            {
              name: `🎣 Fishing Rod *(${invData.FishingRod || `0`})* - ${
                client.config.ecoIcon
              }\`2999\``,
              value: "Can use to catch some fish from the ocean",
            },
            {
              name: `💻 Laptop *(${invData.Laptop || `0`})* - ${
                client.config.ecoIcon
              }\`4750\``,
              value: "Can use to post some Blogs.",
            },
            {
              name: `<:shovel:1034130304971063467> Shovel *(${
                invData.Shovel || `0`
              })* - ${client.config.ecoIcon}\`3250\``,
              value: "Can use to dig some earth and get some goods.",
            },
            {
              name: `<:TranquilizerDart:1034132988033761423> Tranquilizer Dart *(${
                invData.TranquilizerDart || `0`
              })* - ${client.config.ecoIcon}\`99\``,
              value: "Dart is needed to be able to use Dart Rifle",
            }
          );
        }
        if (value.includes("powerups")) {
          await embed.addFields({
            name: `💵 Banknote *(${invData.Banknote || `0`})* - ${
              client.config.ecoIcon
            }\`9999\``,
            value: "You can use it to get some BankLimit Increase.",
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
        **Try Using:** </shop:1034079647299817552>!`),
        ],
        components: [],
      });
    });
  },
};
