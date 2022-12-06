const { EmbedBuilder } = require("discord.js");
const ecoDB = require("../../src/models/ecoDB");

module.exports = {
  name: "beg",
  description: "Beg to get some Yur.",
  cooldown: 300,
  category: "Eco",
  async execute(interaction, client) {
    const { member, guild } = interaction;
    const title = [
      "Corbin King",
      "Roman Duke",
      "Krzysztof Cano",
      "Kay Pruitt",
      "Charlton Macias",
      "Marni Boyd",
      "May Poole",
      "Emma Bloom",
      "Hawa Wilks",
      "Miser Johnson",
      "Elon Musk",
      "Chay May",
      "Barack Obama",
      "Humphrey Hendricks",
      "Kirk Mackie",
      "Bill Gates",
      "Kirsty Clarke",
      "Mr. Scrooge",
      "Mr. Miser",
      "Aron Gilbert",
      "Shaan Reese",
      "Ralph Munoz",
      "Dorothy Levine",
      "Nabeela Huffman",
      "Jarrod Mack",
      "Isabel Thatcher",
    ];

    const randomNumber = Math.floor(Math.random() * 80) + 20;
    const randomNumberTop = Math.floor(Math.random() * 500) + 100;
    const rubyChance = Math.random();
    const RubiesTop = Math.floor(Math.random() * 20) + 8;
    const Rubies = Math.floor(Math.random() * 8) + 1;

    const FinalTitle = Math.floor(Math.random() * title.length);

    const embed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle(`${title[FinalTitle]}`)
      .setFooter({
        text: "Ryou - Economy",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(guild.iconURL({ dynamic: true }));
    if (
      title[FinalTitle] === "Elon Musk" ||
      title[FinalTitle] === "Bill Gates"
    ) {
      if (rubyChance > 0.2) {
        await ecoDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Cash: +randomNumberTop } }
        );
        return interaction.reply({
          embeds: [
            embed.setDescription(
              `"You Know, Begging isn't a good Thing!
          Here Take ${client.config.ecoIcon}${randomNumberTop}, Start Working and Earn!"`
            ),
          ],
        });
      } else if (rubyChance <= 0.2) {
        await ecoDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Cash: +randomNumberTop, Ruby: +RubiesTop } }
        );
        return interaction.reply({
          embeds: [
            embed.setDescription(
              `"You Know, Begging isn't a good Thing!
          Here Take ${client.config.ecoIcon}${randomNumberTop} & <:Ruby:1034416992813326417>${RubiesTop}, Start Working and Earn!"`
            ),
          ],
        });
      }
    } else if (
      title[FinalTitle] === "Mr. Miser" ||
      title[FinalTitle] === "Miser Johnson" ||
      title[FinalTitle] === "Mr. Scrooge"
    ) {
      return interaction.reply({
        embeds: [
          embed
            .setTitle(`${title[FinalTitle]}`)
            .setDescription(`"Hell Na! go and Work You Stupid Beggars!"`),
        ],
      });
    } else {
      if (rubyChance > 0.2) {
        await ecoDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Cash: +randomNumber } }
        );

        return interaction.reply({
          embeds: [
            embed.setDescription(
              `"You Poor Beggar, Here Take ${client.config.ecoIcon}${randomNumber}."`
            ),
          ],
        });
      } else if (rubyChance <= 0.2) {
        await ecoDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Cash: +randomNumber, Ruby: +Rubies } }
        );

        return interaction.reply({
          embeds: [
            embed.setDescription(
              `"You Poor Beggar, Here Take ${client.config.ecoIcon}${randomNumber} & <:Ruby:1034416992813326417>${Rubies}."`
            ),
          ],
        });
      }
    }
  },
};
