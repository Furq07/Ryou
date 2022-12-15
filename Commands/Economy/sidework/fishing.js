const { EmbedBuilder } = require("discord.js");
const invDB = require("../../../src/models/invDB");
module.exports = {
  subCommand: "go.fishing",
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
    if (invData.FishingRod == undefined || invData.FishingRod <= 0)
      return interaction.reply({
        content: `You went Fishing, but then found out, you forgot to buy an Fishing Rod`,
      });
    const fish = [
      "Fish 🐟",
      "Tropical Fish 🐠",
      "Puffer Fish 🐡",
      "Dolphin 🐬",
      "Seal 🦭",
      "Vaquita <:Vaquita:1032632410615062538>",
      "Shark 🦈",
      "Shrimp 🦐",
      "Squid 🦑",
      "Octopus 🐙",
      "Lobster 🦞",
      "Boot 👞",
    ];
    const result = Math.floor(Math.random() * fish.length);
    let fishingEmbed = embed.setDescription(
      `You just found a ${fish[result]} while you were Fishing!`
    );

    switch (fish[result]) {
      case "Fish 🐟":
        interaction.reply({
          embeds: [fishingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Fish: +1 } }
        );
        break;
      case "TropicalFish 🐠":
        interaction.reply({
          embeds: [fishingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { TropicalFish: +1 } }
        );
        break;
      case "PufferFish 🐡":
        interaction.reply({
          embeds: [fishingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { PufferFish: +1 } }
        );
        break;
      case "Dolphin 🐬":
        interaction.reply({
          embeds: [fishingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Dolphin: +1 } }
        );
        break;
      case "Seal 🦭":
        interaction.reply({
          embeds: [fishingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Seal: +1 } }
        );
        break;
      case "Shrimp 🦐":
        interaction.reply({
          embeds: [fishingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Shrimp: +1 } }
        );
        break;

      case "Squid 🦑":
        interaction.reply({
          embeds: [fishingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Squid: +1 } }
        );
        break;
      case "Octopus 🐙":
        interaction.reply({
          embeds: [fishingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Octopus: +1 } }
        );
        break;
      case "Lobster 🦞":
        interaction.reply({
          embeds: [fishingEmbed],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Lobster: +1 } }
        );
        break;
      case "Vaquita <:Vaquita:1032632410615062538>":
        interaction.reply({
          embeds: [
            embed.setDescription(
              `You just Found an Rare Animal ${fish[result]}, You successfully Caught it, You sure gonna get some cash from Zoo!`
            ),
          ],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Vaquita: +1 } }
        );
        break;
      case "Boot 👞":
        const random = Math.floor(Math.random() * 3) + 1;
        if (random == 1) {
          interaction.reply({
            embeds: [
              embed.setDescription(
                `You just Found an Rare Animal Vaquita <:Vaquita:1032632410615062538>, You successfully Lost sight of it, You sure gonna get some spank from Zoo!`
              ),
            ],
          });
        } else {
          interaction.reply({
            embeds: [
              embed.setDescription(
                `You just found an EMOTIONAL DAMAGE 💀, *since you found an ${fish[result]} while you were fishing.*`
              ),
            ],
          });
        }
        break;
      case "Shark 🦈":
        interaction.reply({
          embeds: [
            embed.setDescription(
              `You just found an ${fish[result]}, but it was about to kill you, so you just ran away. *also you lost your Fishing Rod 😐*`
            ),
          ],
        });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { FishingRod: -1 } }
        );
        break;
    }
  },
};
