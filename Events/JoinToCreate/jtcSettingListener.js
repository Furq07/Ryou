const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentType,
  TextInputStyle,
  ModalBuilder,
  TextInputBuilder,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    const setupData = await setupDB.findOne({ GuildID: interaction.guild.id });
    const isFound = setupData.JTCInfo.some((element) => {
      if (element.owner === interaction.member.id) return true;
      else return false;
    });

    const { customId, guild } = interaction;
    const globalEmbed = new EmbedBuilder().setColor("#800000");
    if (
      [
        "jtc-delete-vc-button",
        "jtc-user-limit-button",
        "jtc-lock-channel-button",
        "jtc-rename-vc-button",
        "resetup-jtc-button",
        "jtc-unlock-channel-button",
        "jtc-add-user-button",
        "jtc-remove-user-button",
        "jtc-hide-button",
        "jtc-unhide-button",
      ].includes(customId)
    ) {
      if (isFound === false) {
        return interaction.reply({
          embeds: [
            globalEmbed
              .setTitle("Whoopsi...")
              .setDescription(
                `Seems you don't own any Custom VC yet.\n\n You can make one by joining <#${setupData.JTCChannelID}>`
              )
              .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: "Ryou - Error",
              })
              .setThumbnail(guild.iconURL({ dynamic: true })),
          ],
          ephemeral: true,
        });
      }
      switch (customId) {
        case "jtc-delete-vc-button":
          const deleteChannelIsFound = setupData.JTCInfo.find((element) => {
            if (element.owner === interaction.user.id) {
              return element.channel;
            }
          });
          try {
            interaction.guild.channels.cache
              .find((r) => r.id === deleteChannelIsFound.channel)
              .delete();
          } catch {
            interaction.reply({
              embeds: [
                globalEmbed
                  .setTitle("Deleted your Custom VC")
                  .setDescription(
                    `You have successfully deleted your Custom VC\n\nIf you want to create a new one just hop into <#${setupData.JTCChannelID}>`
                  ),
              ],
              ephemeral: true,
            });
            await setupDB.updateOne(
              {
                GuildID: interaction.guild.id,
              },
              { $pull: { JTCInfo: { owner: interaction.user.id } } }
            );
          }

          await setupDB.updateOne(
            {
              GuildID: interaction.guild.id,
            },
            { $pull: { JTCInfo: { owner: interaction.user.id } } }
          );
          await interaction.reply({
            embeds: [
              globalEmbed
                .setTitle("Deleted your Custom VC")
                .setDescription(
                  `You have successfully deleted your custom vc\n\nIf you want to create a new one just hop into <#${setupData.JTCChannelID}>`
                ),
            ],
            components: [],
            ephemeral: true,
          });
          break;
        case "jtc-user-limit-button":
          const changeuserModal = new ModalBuilder()
            .setCustomId(`jtc-update-user-limit-modal`)
            .setTitle(`Update your custom vc user limit`);

          const changeUserLimitTextInput = new TextInputBuilder()
            .setCustomId(`jtc-update-user-limit-input`)
            .setLabel(`Provide new user limit (0 = unlimited)`)
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Enter the new user limit")
            .setMaxLength(2)
            .setMinLength(1);
          changeuserModal.addComponents(
            new ActionRowBuilder().addComponents(changeUserLimitTextInput)
          );
          interaction.showModal(changeuserModal);
          break;
        case "jtc-rename-vc-button":
          const changeNameModal = new ModalBuilder()
            .setCustomId(`jtc-change-name-modal`)
            .setTitle(`Rename your custom vc`);

          const changeNameTextInput = new TextInputBuilder()
            .setCustomId(`jtc-change-name-input`)
            .setLabel(`Enter name for you custom vc`)
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("New name")
            .setMaxLength(32)
            .setMinLength(2);
          changeNameModal.addComponents(
            new ActionRowBuilder().addComponents(changeNameTextInput)
          );
          interaction.showModal(changeNameModal);

          break;
        case "jtc-unlock-channel-button":
          const userLimitIsFound3 = setupData.JTCInfo.find((element) => {
            if (element.owner === interaction.user.id) {
              return element.channel;
            }
          });
          if (
            interaction.guild.channels.cache
              .get(userLimitIsFound3.channel)
              .permissionsFor(interaction.guild.roles.everyone.id)
              .has("Connect")
          )
            return interaction.reply({
              embeds: [
                globalEmbed
                  .setTitle("Whoopsi...")
                  .setDescription(
                    `It looks like your Custom VC is already been unlocked.\n\nYou can lock it by using the \`Lock VC\`button from above.`
                  )
                  .setFooter({
                    iconURL: client.user.displayAvatarURL(),
                    text: "Ryou - Error",
                  })
                  .setThumbnail(guild.iconURL({ dynamic: true })),
              ],
              ephemeral: true,
            });

          interaction.guild.channels.cache
            .get(userLimitIsFound3.channel)
            .permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
              Connect: true,
              Speak: true,
            });
          await interaction.reply({
            embeds: [
              globalEmbed
                .setTitle("Unlocked your Custom VC")
                .setDescription(
                  `You have successfully unlocked your Custom VC for <@${guild.roles.everyoneid}>.\n\n**Vc Information**\n**Name**: <#${userLimitIsFound3.channel}>\n**ID**: ${userLimitIsFound3.channel}\n**User Limit**: ${userLimitIsFound3.userLimit}`
                ),
            ],
            components: [],
            ephemeral: true,
          });

          break;
        case "jtc-lock-channel-button":
          const userLimitIsFound4 = setupData.JTCInfo.find((element) => {
            if (element.owner === interaction.user.id) {
              return element;
            }
          });
          if (
            !interaction.guild.channels.cache
              .get(userLimitIsFound4.channel)
              .permissionsFor(interaction.guild.roles.everyone.id)
              .has("Connect")
          )
            return interaction.reply({
              embeds: [
                globalEmbed
                  .setTitle("Whoopsi...")
                  .setDescription(
                    `It looks like your Custom VC is already been locked.\n\nYou can unlock it by using the \`Lock VC\` button from above.`
                  )
                  .setFooter({
                    iconURL: client.user.displayAvatarURL(),
                    text: "Ryou - Error",
                  })
                  .setThumbnail(guild.iconURL({ dynamic: true })),
              ],
              ephemeral: true,
            });

          interaction.guild.channels.cache
            .get(userLimitIsFound4.channel)
            .permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
              Connect: false,
              Speak: false,
            });
          interaction.reply({
            embeds: [
              globalEmbed
                .setTitle("Locked your Custom VC")
                .setDescription(
                  `You have successfully locked your Custom VC for <@${guild.roles.everyone.id}>.`
                ),
            ],
            components: [],
            ephemeral: true,
          });
          break;
        case "jtc-add-user-button":
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setTitle("Add user to your Custom VC")
                .setDescription(
                  `If you want to add a user to your Custom VC, use </add-user:1055520156073328766> command to\nadd in any command channel`
                ),
            ],
            ephemeral: true,
          });
          break;
        case "jtc-remove-user-button":
          interaction.reply({
            embeds: [
              globalEmbed
                .setTitle("Remove user from your custom vc")
                .setDescription(
                  `If you want to remove a user from your Custom VC, use </remove-user:1055520156073328767> command to\nadd in any command channel`
                ),
            ],
            ephemeral: true,
          });
          break;
        case "jtc-hide-button":
          const userLimitIsFound5 = setupData.JTCInfo.find((element) => {
            if (element.owner === interaction.user.id) {
              return element;
            }
          });
          if (
            !interaction.guild.channels.cache
              .get(userLimitIsFound5.channel)
              .permissionsFor(interaction.guild.roles.everyone.id)
              .has("ViewChannel")
          )
            return interaction
              .reply({
                embeds: [
                  globalEmbed
                    .setTitle("Whoopsi...")
                    .setDescription(
                      `Your Custom VC is already hidden for <@${guild.roles.everyone.id}> role except for the user(s) you added yourself.\n\nYou can unhide it by using the \`Unhide VC\` button fromabove.`
                    )
                    .setFooter({
                      iconURL: client.user.displayAvatarURL(),
                      text: "Ryou - Error",
                    })
                    .setThumbnail(guild.iconURL({ dynamic: true })),
                ],
                ephemeral: true,
              })
              .catch(() => {
                return;
              });

          interaction.guild.channels.cache
            .get(userLimitIsFound5.channel)
            .permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
              ViewChannel: false,
            });

          const jtcusers2 = userLimitIsFound5.users.map((a) => ({
            id: a.id,
            added: a.added === false,
          }));
          var size2 = Object.keys(userLimitIsFound5.users).length;
          if (jtcusers2) {
            for (let i = 0; i < size2; i++) {
              guild.members
                .fetch(`${jtcusers2[i].id}`)
                .then((user) => {
                  if (
                    !interaction.guild.channels.cache
                      .get(`${userLimitIsFound5.channel}`)
                      .permissionsFor(`${user.id}`)
                      .has("Connect")
                  ) {
                    interaction.guild.channels.cache
                      .get(userLimitIsFound5.channel)
                      .permissionOverwrites.edit(user, {
                        ViewChannel: false,
                      });
                  }
                })
                .catch(() => {
                  return;
                });
            }
          }

          await setupDB.updateOne(
            {
              GuildID: interaction.guild.id,
              "JTCInfo.owner": interaction.user.id,
            },
            {
              $set: {
                "JTCInfo.$.hidden": true,
              },
            }
          );
          await interaction.reply({
            embeds: [
              globalEmbed
                .setTitle("Hided your Custom VC")
                .setDescription(
                  `You have successfully hided your Custom VC for ${guild.roles.everyone.id} except for the users you added yourself.`
                ),
            ],
            components: [],
            ephemeral: true,
          });
          break;
        case "jtc-unhide-button":
          const userLimitIsFound6 = setupData.JTCInfo.find((element) => {
            if (element.owner === interaction.user.id) {
              return element;
            }
          });

          if (
            interaction.guild.channels.cache
              .get(userLimitIsFound6.channel)
              .permissionsFor(interaction.guild.roles.everyone.id)
              .has("ViewChannel")
          )
            return interaction.reply({
              embeds: [
                globalEmbed
                  .setTitle("Whoopsi...")
                  .setDescription(
                    `Your channel is already unhided for <@${guild.roles.everyone.id}> role.\n\nYou can hide it by using the \`Hide VC\` button from above.`
                  )
                  .setFooter({
                    iconURL: client.user.displayAvatarURL(),
                    text: "Ryou - Error",
                  })
                  .setThumbnail(guild.iconURL({ dynamic: true })),
              ],
              ephemeral: true,
            });

          interaction.guild.channels.cache
            .get(userLimitIsFound6.channel)
            .permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
              ViewChannel: true,
            });
          const jtcusers = userLimitIsFound6.users.map((a) => ({
            id: a.id,
            added: a.added === false,
          }));
          var size = Object.keys(userLimitIsFound6.users).length;
          if (jtcusers) {
            for (let i = 0; i < size; i++) {
              guild.members
                .fetch(`${jtcusers[i].id}`)
                .then((user) => {
                  interaction.guild.channels.cache
                    .get(`${userLimitIsFound6.channel}`)
                    .permissionOverwrites.edit(user, {
                      ViewChannel: true,
                    });
                })
                .catch(() => {});
            }
          }
          await setupDB.updateOne(
            {
              GuildID: interaction.guild.id,
              "JTCInfo.owner": interaction.user.id,
            },
            {
              $set: {
                "JTCInfo.$.hidden": false,
              },
            }
          );
          interaction.reply({
            embeds: [
              globalEmbed
                .setTitle("UnHided your Custom VC")
                .setDescription(
                  `You have successfully unhided your Custom VC for <@${guild.roles.everyone.id}>.`
                ),
            ],
            components: [],
            ephemeral: true,
          });
          break;
      }
    }
  },
};
