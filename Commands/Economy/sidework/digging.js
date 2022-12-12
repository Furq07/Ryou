const { EmbedBuilder } = require("discord.js");
const invDB = require("../../../src/models/invDB");
module.exports = {
  subCommand: "go.digging",
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
    if (invData.Shovel == undefined || invData.Shovel <= 0)
      return interaction.reply({
        content: `You went Digging, but then found out, you forgot to buy an Shovel`,
      });
    const dig = [
      "Bug 🐛",
      "Worm 🪱",
      "Cricket 🦗",
      "Scorpion 🦂",
      "Beetle 🪲",
      "Fossil <:Fossil:1032699142599884871>",
      "Treasure 🪙",
      "Garbage 🗑️",
      "Nothing 💀",
    ];
    const result = Math.floor(Math.random() * dig.length);
    let diggingEmbed = embed.setDescription(
      `You just found a ${dig[result]} while you were Digging!`
    );
    switch (dig[result]) {
      case "Bug 🐛":
        interaction.reply({
          embeds: [diggingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Bug: +1 } }
        );
        break;
      case "Worm 🪱":
        interaction.reply({
          embeds: [diggingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Worm: +1 } }
        );
        break;
      case "Cricket 🦗":
        interaction.reply({
          embeds: [diggingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Cricket: +1 } }
        );
        break;
      case "Beetle 🪲":
        interaction.reply({
          embeds: [diggingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Beetle: +1 } }
        );
        break;
      case "Garbage 🗑️":
        interaction.reply({
          embeds: [diggingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Garbage: +1 } }
        );
        break;
      case "Fossil <:Fossil:1032699142599884871>":
        interaction.reply({
          embeds: [diggingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Fossil: +1 } }
        );
        break;
      case "Treasure 🪙":
        interaction.reply({
          embeds: [
            embed.setDescription(
              `You just Found an ${dig[result]}, You were successfully able to Loot it!, You sure gonna get some cash from Museum!`
            ),
          ],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Treasure: +1 } }
        );
        break;
      case "Nothing 💀":
        const random = Math.floor(Math.random() * 3) + 1;
        if (random == 1) {
          interaction.reply({
            embeds: [
              embed.setDescription(
                `You just Found an Treasure 🪙, You were successfully able to let other's loot it, You sure gonna get nothing from Museum!`
              ),
            ],
          });
        } else {
          interaction.reply({
            embeds: [
              embed.setDescription(
                `You just found an EMOTIONAL DAMAGE 💀, *since you digged day and night, but found nothing.*`
              ),
            ],
          });
        }
        break;
      case "Scorpion 🦂":
        interaction.reply({
          embeds: [
            embed.setDescription(
              `You just found an ${dig[result]}, but it sting you, and you went unconscious. *also you lost your Shovel, since you were taken to Hospital 😐*`
            ),
          ],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Shovel: -1 } }
        );
        break;
    }
  },
};
