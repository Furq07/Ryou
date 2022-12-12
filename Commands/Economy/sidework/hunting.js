const { EmbedBuilder } = require("discord.js");
const invDB = require("../../../src/models/invDB");
module.exports = {
  subCommand: "go.hunting",
  cooldown: 600,
  async execute(interaction, client) {
    const { member, options } = interaction;
    const work = options.getString("work");
    const invData = await invDB.findOne({ MemberID: member.id });
    const embed = new EmbedBuilder()
      .setTitle("WorkPlace")
      .setColor("#800000")
      .setFooter({
        text: "Ryou - Economy",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });
    if (invData.DartRifle == undefined || invData.DartRifle <= 0)
      return interaction.reply({
        content: `You went to Hunt, but then found out, you forgot to buy an Dart Rifle <:DartRifle:1032644289672511568>`,
      });
    if (invData.TranquilizerDart == undefined || invData.TranquilizerDart <= 0)
      return interaction.reply({
        content: `You went to Hunt, but then found out, you forgot to buy Tranquilizer Darts <:TranquilizerDart:1034132988033761423>, I mean what you gonna shot at them.`,
      });
    const hunt = [
      "Fox 🦊",
      "Chicken 🐔",
      "Cow 🐄",
      "Dove 🕊️",
      "Boar 🐗",
      "Panda 🐼",
      "Gorilla 🦍",
      "Turkey 🦃",
      "Swan 🦢",
      "Duck 🦆",
      "Dodo 🦤",
      "Nothing 💀",
    ];
    const result = Math.floor(Math.random() * hunt.length);
    let huntingEmbed = embed.setDescription(
      `You just found a ${hunt[result]} while you were Hunting!`
    );

    switch (hunt[result]) {
      case "Fox 🦊":
        interaction.reply({
          embeds: [huntingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Fox: +1 } }
        );
        break;
      case "Chicken 🐔":
        interaction.reply({
          embeds: [huntingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Chicken: +1 } }
        );
        break;
      case "Cow 🐄":
        interaction.reply({
          embeds: [huntingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Cow: +1 } }
        );
        break;
      case "Dove 🕊️":
        interaction.reply({
          embeds: [huntingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Dove: +1 } }
        );
        break;
      case "Boar 🐗":
        interaction.reply({
          embeds: [huntingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Boar: +1 } }
        );
        break;
      case "Panda 🐼":
        interaction.reply({
          embeds: [huntingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Panda: +1 } }
        );
        break;

      case "Turkey 🦃":
        interaction.reply({
          embeds: [huntingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Turkey: +1 } }
        );
        break;
      case "Swan 🦢":
        interaction.reply({
          embeds: [huntingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Swan: +1 } }
        );
        break;
      case "Duck 🦆":
        interaction.reply({
          embeds: [huntingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Duck: +1 } }
        );
        break;
      case "Dodo 🦤":
        interaction.reply({
          embeds: [
            embed.setDescription(
              `You just Found an Extinct Animal ${hunt[result]}, You successfully Caught it, You sure gonna get some cash from Zoo!`
            ),
          ],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Dodo: +1 } }
        );
        break;
      case "Nothing 💀":
        const random = Math.floor(Math.random() * 3) + 1;
        if (random == 1) {
          interaction.reply({
            embeds: [
              embed.setDescription(
                `You just Found an Extinct Animal Dodo 🦤, You successfully Lost sight of it, You sure gonna get some spank from Zoo!`
              ),
            ],
          });
        } else {
          interaction.reply({
            embeds: [
              embed.setDescription(
                `You just found an EMOTIONAL DAMAGE 💀, *since you found nothing while trying to hunt.*`
              ),
            ],
          });
        }
        break;
      case "Gorilla 🦍":
        interaction.reply({
          embeds: [
            embed.setDescription(
              `You just found an ${hunt[result]}, but he was looking pretty angry so you ran away. *also you lost your Dart Rifle <:DartRifle:1032644289672511568> 😐*`
            ),
          ],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { DartRifle: -1 } }
        );
        break;
    }
  },
};
