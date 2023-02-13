const {
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const { readdirSync } = require("fs");
module.exports = {
  name: "help",
  description: "This Command Gives Help!",
  async execute(interaction, client) {
    const { member, guild, channel } = interaction;
    var pages = [];
    let i = 0,
      j = 0;
    let emojis = {
      economy: "💰",
      moderation: "🛠",
      fun: "😂",
      info: "ℹ",
      utils: "🔨",
    };
    let indexOfCat = {
      economy: 0,
      moderation: 0,
      fun: 0,
      info: 0,
      utils: 0,
    };
    readdirSync(`./Commands/`).forEach((dir) => {
      const commands = readdirSync(`./Commands/${dir}/`);
      indexOfCat[dir] = j;
      var allCommands = "";
      pages[i] = [];
      pages[i].push(`${emojis[dir]}`);
      pages[i].push(`${dir.toUpperCase()}\n`);
      for (let file of commands) {
        let pull = require(`../${dir}/${file}`);

        if (pull.name && pull.description) {
          allCommands += `**• ${
            pull.name[0].toUpperCase() + pull.name.slice(1).toLowerCase()
          }** - \`/${pull.name}\`
          - ${pull.description || "Not provide"}\n\n`;
        } else {
          continue;
        }
      }
      pages[i].push(allCommands);
      j++;
      i++;
    });

    let categories = [];
    pages.forEach(async (page, i) => {
      categories.push({
        label: `${
          pages[i][1][0].toUpperCase() + pages[i][1].slice(1).toLowerCase()
        }`,
        emoji: {
          name: `${pages[i][0]}`,
        },
        value: `${pages[i][1].toLowerCase()}`,
      });
      pages[i] = new EmbedBuilder()
        .setAuthor({
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
          name: "Ryou - Info",
        })
        .setTitle(`**${pages[i][0]} | ${pages[i][1]}**`)
        .setDescription(`${pages[i][2]}`)
        .setColor("#800000")
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setFooter({
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
          text: "Ryou - Info",
        });
    });

    let row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("help")
        .setPlaceholder("Choose Category Here!")
        .addOptions(categories)
    );
    const startEmbed = new EmbedBuilder()
      .setTitle("Huh, You Want Help?")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(
        "Hi My Name is **Ryou**\nI was Made by **Furqan Ahmed Khan (Furq) & Zuhaz Arshad (Zhuz)**"
      )
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Select Category From Down Below!",
      });
    const endEmbed = new EmbedBuilder()
      .setTitle("Are you Confused?")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(
        "Try </help:1009089587026591806> to get an list of commands!"
      )
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Info",
      });
    interaction.reply({
      embeds: [startEmbed],
      components: [row],
    });

    const collector = channel.createMessageComponentCollector({
      componentType: ComponentType.SelectMenu,
      time: 60000,
    });
    collector.on("collect", async (collected) => {
      if (["help"].includes(collected.customId)) {
        collected.update({
          embeds: [pages[indexOfCat[collected.values[0].replaceAll("\n", "")]]],
        });
      }
    });
    collector.on("end", () => {
      interaction.editReply({
        embeds: [endEmbed],
        components: [],
      });
    });
  },
};
