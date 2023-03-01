// const {
//   ActionRowBuilder,
//   ButtonStyle,
//   ButtonBuilder,
//   EmbedBuilder,
// } = require("discord.js");
// const setupDB = require("../../src/models/setupDB");
// module.exports = {
//   name: "interactionCreate",
//   async execute(interaction, client) {
//     if (!interaction.isAnySelectMenu()) return;
//     const { customId, guild, values, message, channel, member } = interaction;
//     const msg = await channel.messages.fetch(message.id);
//     const data = msg.components[0];
//     const newActionRow = ActionRowBuilder.from(data);
//     const Value = values.join(", ");
//     const setupData = await setupDB.findOne({ GuildID: guild.id });
//     if (["jtc-add-user-button", "jtc-remove-user-buttons"].includes(customId)) {
//       switch (customId) {
//         case "jtc-add-user-button":
//           await setupDB.findOneAndUpdate(
//             { GuildID: guild.id },
//             { CommunityRoleID: Value }
//           );
//           newActionRow.components[0]
//             .setDisabled(false)
//             .setStyle(ButtonStyle.Success);
//           newActionRow.components[1].setDisabled(false);
//           newActionRow.components[2].setDisabled(false);
//           interaction.update({ components: [newActionRow] });
//           break;
//         case "jtc-remove-user-button":
//           await setupDB.findOneAndUpdate(
//             { GuildID: guild.id },
//             { StaffRoleID: Value }
//           );
//           newActionRow.components[0].setDisabled(false);
//           newActionRow.components[1]
//             .setDisabled(false)
//             .setStyle(ButtonStyle.Success);
//           newActionRow.components[2].setDisabled(false);
//           interaction.update({ components: [newActionRow] });
//           break;
//       }
//     }
//   },
// };

// // const user = interaction.options.getMember("user");
// // const setupData = await setupDB.findOne({ GuildID: interaction.guild.id });
// // const isFound = setupData.JTCInfo.some((element) => {
// //   if (element.owner === interaction.member.id) {
// //     return true;
// //   } else {
// //     return false;
// //   }
// // });
// // if (isFound === false)
// //   return interaction.reply({
// //     content: "You dont own any custom vc yet",
// //     ephemeral: true,
// //   });
// // const userLimitIsFound = setupData.JTCInfo.find((element) => {
// //   if (element.owner === interaction.user.id) {
// //     return element;
// //   }
// // });

// // if (
// //   interaction.guild.channels.cache
// //     .get(userLimitIsFound.channels)
// //     .permissionsFor(user.id)
// //     .has("Connect")
// // )
// //   return interaction.reply({
// //     content: "You have already added this user into your vc",
// //     ephemeral: true,
// //   });
// // if (userLimitIsFound.hidden === true) {
// //   interaction.guild.channels.cache
// //     .get(userLimitIsFound.channels)
// //     .permissionOverwrites.edit(user.id, {
// //       Connect: true,
// //       Speak: true,
// //       ViewChannel: true,
// //     })
// //     .then(async () => {
// //       const jtcusers = userLimitIsFound.users.find((element) => {
// //         return element.id;
// //       });
// //       await setupDB.updateOne(
// //         {
// //           GuildID: interaction.guild.id,
// //           "JTCInfo.owner": interaction.user.id,
// //         },
// //         {
// //           $addToSet: {
// //             "JTCInfo.$.users": { id: user.id, added: true },
// //           },
// //         }
// //       );
// //       if (userLimitIsFound.users) {
// //         var size = Object.keys(userLimitIsFound.users).length;
// //       }
// //       if (size == 0) {
// //         size = 1;
// //       } else {
// //         size = size + 1;
// //       }
// //       if (
// //         size >=
// //           interaction.guild.channels.cache.get(userLimitIsFound.channels)
// //             .userLimit &&
// //         interaction.guild.channels.cache.get(userLimitIsFound.channels)
// //           .userLimit !== 0
// //       ) {
// //         interaction.guild.channels.cache
// //           .get(userLimitIsFound.channels)
// //           .setUserLimit(
// //             interaction.guild.channels.cache.get(userLimitIsFound.channels)
// //               .userLimit + 1
// //           );
// //         await setupDB.updateOne(
// //           {
// //             GuildID: interaction.guild.id,
// //             "JTCInfo.owner": interaction.user.id,
// //           },
// //           {
// //             $set: {
// //               "JTCInfo.$.userLimit":
// //                 interaction.guild.channels.cache.get(
// //                   userLimitIsFound.channels
// //                 ).userLimit + 1,
// //             },
// //           }
// //         );
// //       }
// //     });

// //   interaction
// //     .reply({
// //       content: `Successfully added ${user} to your custom vc`,
// //       ephemeral: true,
// //     })
// //     .catch((err) => {
// //       return;
// //     });
// // } else {
// //   interaction.guild.channels.cache
// //     .get(userLimitIsFound.channels)
// //     .permissionOverwrites.edit(user.id, {
// //       Connect: true,
// //       Speak: true,
// //       ViewChannel: true,
// //     })
// //     .then(async () => {
// //       if (userLimitIsFound.users) {
// //         var size = Object.keys(userLimitIsFound.users).length;
// //       }
// //       const userFound = userLimitIsFound.users.find((element) => {
// //         if (element.id === user.id) {
// //           return element;
// //         }
// //       });
// //       if (userFound) {
// //         if (userFound.added === false) {
// //           await setupDB
// //             .updateOne(
// //               {
// //                 GuildID: interaction.guild.id,
// //                 "JTCInfo.owner": interaction.user.id,
// //               },
// //               {
// //                 $pull: {
// //                   "JTCInfo.$.users": { id: user.id },
// //                 },
// //               }
// //             )
// //             .then(async () => {
// //               await setupDB.updateOne(
// //                 {
// //                   GuildID: interaction.guild.id,
// //                   "JTCInfo.owner": interaction.user.id,
// //                 },
// //                 {
// //                   $addToSet: {
// //                     "JTCInfo.$.users": { id: user.id, added: true },
// //                   },
// //                 }
// //               );
// //             });
// //         }
// //       } else {
// //         await setupDB.updateOne(
// //           {
// //             GuildID: interaction.guild.id,
// //             "JTCInfo.owner": interaction.user.id,
// //           },
// //           {
// //             $push: {
// //               "JTCInfo.$.users": { id: user.id, added: true },
// //             },
// //           }
// //         );
// //       }

// //       if (size == 0) {
// //         size = 1;
// //       } else {
// //         size = size + 1;
// //       }
// //       if (
// //         size >=
// //           interaction.guild.channels.cache.get(userLimitIsFound.channels)
// //             .userLimit &&
// //         interaction.guild.channels.cache.get(userLimitIsFound.channels)
// //           .userLimit !== 0
// //       ) {
// //         interaction.guild.channels.cache
// //           .get(userLimitIsFound.channels)
// //           .setUserLimit(
// //             interaction.guild.channels.cache.get(userLimitIsFound.channels)
// //               .userLimit + 1
// //           );
// //         await setupDB.updateOne(
// //           {
// //             GuildID: interaction.guild.id,
// //             "JTCInfo.owner": interaction.user.id,
// //           },
// //           {
// //             $set: {
// //               "JTCInfo.$.userLimit":
// //                 interaction.guild.channels.cache.get(
// //                   userLimitIsFound.channels
// //                 ).userLimit + 1,
// //             },
// //           }
// //         );
// //       }
// //     });

// //   await interaction
// //     .reply({
// //       content: `Successfully added ${user} to your custom vc`,
// //       ephemeral: true,
// //     })
// //     .catch((err) => {
// //       return;
// //     });
// // }
