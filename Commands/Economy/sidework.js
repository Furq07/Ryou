const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const invDB = require("../../src/models/invDB");
module.exports = {
  name: "sidework",
  description: "Work side jobs to do random stuff to earn some Yur!",
  cooldown: 600,
  category: "Eco",
  options: [
    {
      name: "work",
      description: "Choose an random work you wanna do!",
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "Hunt Animals", value: "hunt" },
        { name: "Catch Fish", value: "fish" },
        { name: "Dig Earth", value: "dig" },
      ],
      required: true,
    },
  ],
  async execute(interaction, client) {
    const { channel, guild, member, options } = interaction;
    const work = options.getString("work");
    const invData = await invDB.findOne({ MemberID: member.id });
    const embed = new EmbedBuilder()
      .setTitle("WorkPlace")
      .setColor("#800000")
      .setFooter({
        text: "Ryou - Economy",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });
    switch (work) {
      case "hunt": {
        if (invData.DartRifle == undefined || invData.DartRifle <= 0)
          return interaction.reply({
            content: `You went to Hunt, but then found out, you forgot to buy an Dart Rifle <:DartRifle:1032644289672511568>`,
          });
        if (
          invData.TranquilizerDart == undefined ||
          invData.TranquilizerDart <= 0
        )
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
      }
      case "fish": {
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
      }
      case "dig": {
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
      }
    }
  },
};
