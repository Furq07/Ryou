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
      const testChannel = element.owner.channels;
      if (element.owner === interaction.member.id) {
        return true;
      } else {
        return false;
      }
    });

    const { customId, member } = interaction;
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
      switch (customId) {
        case "jtc-delete-vc-button":
          const deleteChannelIsFound = setupData.JTCInfo.find((element) => {
            if (element.owner === interaction.user.id) {
              return element.channels;
            }
          });
          if (isFound === false)
            return interaction.reply({
              content: "You dont own any custom vc yet",
              ephemeral: true,
            });
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setTitle("Delete your custom vc")
                .setDescription(
                  `You are going to delete your custom vc channel\n\n**Vc Information**\n**Name**: <#${deleteChannelIsFound.channels}>\n**ID**: ${deleteChannelIsFound.channels}\n**User Limit**: ${deleteChannelIsFound.userLimit}\nClick the **Yes** button below to start the process and press **No** to stop the process`
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("yes-jtc-channel-delete")
                  .setLabel("Yes")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("no-jtc-channel-delete")
                  .setLabel("No")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
            ephemeral: true,
          });
          const collector = interaction.channel.createMessageComponentCollector(
            {
              componentType: ComponentType.Button,
              time: 15000,
            }
          );
          collector.on("collect", async (collected) => {
            if (collected.customId == "yes-jtc-channel-delete") {
              // deleteChannelIsFound.channels; for future purposes
              interaction.guild.channels.cache
                .find((r) => r.id === deleteChannelIsFound.channels)
                .delete();

              await setupDB.updateOne(
                {
                  GuildID: interaction.guild.id,
                },
                { $pull: { JTCInfo: { owner: interaction.user.id } } }
              );
              await collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setColor("#800000")
                    .setTitle("Deleted your custom vc")
                    .setDescription(
                      `You have successfully deleted your custom vc\n\nIf you want to create a new one just hop into <#${setupData.JTCChannelID}>`
                    ),
                ],
                components: [],
              });
              return;
            } else if (collected.customId == "no-jtc-channel-delete") {
              collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Process cancelled")
                    .setDescription(
                      `Successfully cancelled the deletion of your custom vc`
                    ),
                ],
                components: [],
              });
            }
          });
          break;
        case "jtc-user-limit-button":
          const userLimitIsFound = setupData.JTCInfo.find((element) => {
            if (element.owner === interaction.user.id) {
              return element.channels;
            }
          });
          if (isFound === false)
            return interaction.reply({
              content: "You dont own any custom vc yet",
              ephemeral: true,
            });
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setTitle("Change the userlimit of your custom vc")
                .setDescription(
                  `You are going to update userlimit of your custom vc\n\n**Vc Information**\n**Name**: <#${userLimitIsFound.channels}>\n**ID**: ${userLimitIsFound.channels}\n**User Limit**: ${userLimitIsFound.userLimit}\nClick the **Yes** button below to start the process and press **No** to stop the process`
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("yes-jtc-user-limit")
                  .setLabel("Yes")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("no-jtc-user-limt")
                  .setLabel("No")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
            ephemeral: true,
          });
          const collector2 =
            interaction.channel.createMessageComponentCollector({
              componentType: ComponentType.Button,
              time: 120000,
            });
          collector2.on("collect", async (collected) => {
            if (collected.customId == "yes-jtc-user-limit") {
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
              collected.showModal(changeuserModal).then(() => {
                return;
              });

              return;
            } else if (collected.customId == "no-jtc-user-limt") {
              collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Process cancelled")
                    .setDescription(
                      `Successfully cancelled the changing the user limit of your custom vc`
                    ),
                ],
                components: [],
              });
            }
          });
          break;
        case "jtc-rename-vc-button":
          const userLimitIsFound2 = setupData.JTCInfo.find((element) => {
            if (element.owner === interaction.user.id) {
              return element.channels;
            }
          });
          if (isFound === false)
            return interaction.reply({
              content: "You dont own any custom vc yet",
              ephemeral: true,
            });
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setTitle("Rename your custom vc")
                .setDescription(
                  `You are going to rename your custom vc\n\n**Vc Information**\n**Name**: <#${userLimitIsFound2.channels}>\n**ID**: ${userLimitIsFound2.channels}\n**User Limit**: ${userLimitIsFound2.userLimit}\nClick the **Yes** button below to start the process and press **No** to stop the process`
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("yes-jtc-change-name")
                  .setLabel("Yes")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("no-jtc-change-name")
                  .setLabel("No")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
            ephemeral: true,
          });
          const collector3 =
            interaction.channel.createMessageComponentCollector({
              componentType: ComponentType.Button,
              time: 120000,
            });
          collector3.on("collect", async (collected) => {
            if (collected.customId == "yes-jtc-change-name") {
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
              collected.showModal(changeNameModal);
              return;
            } else if (collected.customId == "no-jtc-change-name") {
              collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Process cancelled")
                    .setDescription(
                      `Successfully cancelled the changing the user limit of your custom vc`
                    ),
                ],
                components: [],
              });
            }
          });
          break;
        case "jtc-unlock-channel-button":
          const userLimitIsFound3 = setupData.JTCInfo.find((element) => {
            if (element.owner === interaction.user.id) {
              return element.channels;
            }
          });
          if (isFound === false)
            return interaction.reply({
              content: "You dont own any custom vc yet",
              ephemeral: true,
            });
          if (
            interaction.guild.channels.cache
              .get(userLimitIsFound3.channels)
              .permissionsFor(interaction.guild.roles.everyone.id)
              .has("Connect")
          )
            return interaction.reply({
              content: "You have already unlocked your vc",
              ephemeral: true,
            });
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setTitle("Unlock your custom vc")
                .setDescription(
                  `You are going to unlock your custom vc to everyone\n\n**Vc Information**\n**Name**: <#${userLimitIsFound3.channels}>\n**ID**: ${userLimitIsFound3.channels}\n**User Limit**: ${userLimitIsFound3.userLimit}\nClick the **Yes** button below to start the process and press **No** to stop the process`
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("yes-jtc-unlock-channel")
                  .setLabel("Yes")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("no-jtc-unlock-channel")
                  .setLabel("No")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
            ephemeral: true,
          });
          const collector5 =
            interaction.channel.createMessageComponentCollector({
              componentType: ComponentType.Button,
              time: 120000,
            });
          collector5.on("collect", async (collected) => {
            if (collected.customId == "yes-jtc-unlock-channel") {
              collected.guild.channels.cache
                .get(userLimitIsFound3.channels)
                .permissionOverwrites.edit(collected.guild.roles.everyone.id, {
                  Connect: true,
                  Speak: true,
                });
              await collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setColor("#800000")
                    .setTitle("Unlocked your custom vc")
                    .setDescription(
                      `You have successfully unlocked your custom vc to everyone\n\n**Vc Information**\n**Name**: <#${userLimitIsFound3.channels}>\n**ID**: ${userLimitIsFound3.channels}\n**User Limit**: ${userLimitIsFound3.userLimit}`
                    ),
                ],
                components: [],
              });
              return;
            } else if (collected.customId == "no-jtc-unlock-channel") {
              collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Process cancelled")
                    .setDescription(
                      `Successfully cancelled the unlocking of your custom vc`
                    ),
                ],
                components: [],
              });
            }
          });
          break;
        case "jtc-lock-channel-button":
          const userLimitIsFound4 = setupData.JTCInfo.find((element) => {
            if (element.owner === interaction.user.id) {
              return element;
            }
          });
          if (isFound === false)
            return interaction.reply({
              content: "You dont own any custom vc yet",
              ephemeral: true,
            });
          if (
            !interaction.guild.channels.cache
              .get(userLimitIsFound4.channels)
              .permissionsFor(interaction.guild.roles.everyone.id)
              .has("Connect")
          )
            return interaction.reply({
              content: "You have already locked your vc",
              ephemeral: true,
            });
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setTitle("Lock your custom vc")
                .setDescription(
                  `You are going to lock your custom vc for everyone\n\n**Vc Information**\n**Name**: <#${userLimitIsFound4.channels}>\n**ID**: ${userLimitIsFound4.channels}\n**User Limit**: ${userLimitIsFound4.userLimit}\nClick the **Yes** button below to start the process and press **No** to stop the process`
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("yes-jtc-lock-channel")
                  .setLabel("Yes")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("no-jtc-lock-channel")
                  .setLabel("No")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
            ephemeral: true,
          });
          const collector6 =
            interaction.channel.createMessageComponentCollector({
              componentType: ComponentType.Button,
              time: 120000,
            });
          collector6.on("collect", async (collected) => {
            if (collected.customId == "yes-jtc-lock-channel") {
              collected.guild.channels.cache
                .get(userLimitIsFound4.channels)
                .permissionOverwrites.edit(collected.guild.roles.everyone.id, {
                  Connect: false,
                  Speak: false,
                });
              collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setColor("#800000")
                    .setTitle("Locked your custom vc")
                    .setDescription(
                      `You have successfully locked your custom vc to everyone\n\n**Vc Information**\n**Name**: <#${userLimitIsFound4.channels}>\n**ID**: ${userLimitIsFound4.channels}\n**User Limit**: ${userLimitIsFound4.userLimit}`
                    ),
                ],
                components: [],
              });
              return;
            } else if (collected.customId == "no-jtc-unlock-channel") {
              collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Process cancelled")
                    .setDescription(
                      `Successfully cancelled the unlocking of your custom vc`
                    ),
                ],
                components: [],
              });
            }
          });
          break;
        case "jtc-add-user-button":
          if (!isFound === true)
            return interaction.reply({
              content: "You dont own any custom vc yet",
              ephemeral: true,
            });
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setTitle("Add user to your custom vc")
                .setDescription(
                  `If you want to add a user to your custom vc, use </add-user:1043238993405415466> command to\nadd in any command channel`
                ),
            ],
            ephemeral: true,
          });
          break;
        case "jtc-remove-user-button":
          if (!isFound === true)
            return interaction.reply({
              content: "You dont own any custom vc yet",
              ephemeral: true,
            });
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setTitle("Remove user from your custom vc")
                .setDescription(
                  `If you want to remove a user from your custom vc, use </remove-user:1043432322378244177> command to\nadd in any command channel`
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
          if (isFound === false)
            return interaction.reply({
              content: "You dont own any custom vc yet",
              ephemeral: true,
            });
          if (
            !interaction.guild.channels.cache
              .get(userLimitIsFound5.channels)
              .permissionsFor(interaction.guild.roles.everyone.id)
              .has("ViewChannel")
          )
            return interaction
              .reply({
                content:
                  "Your channel is already hidden to everyone except for the users you have added yourself",
                ephemeral: true,
              })
              .catch(() => {
                return;
              });
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setTitle("Hide your custom vc")
                .setDescription(
                  `You are going to hide your custom vc for everyone except for the users you have addred yourself \n\n**Vc Information**\n**Name**: <#${userLimitIsFound5.channels}>\n**ID**: ${userLimitIsFound5.channels}\n**User Limit**: ${userLimitIsFound5.userLimit}\nClick the **Yes** button below to start the process and press **No** to stop the process`
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("yes-jtc-hide-channel")
                  .setLabel("Yes")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("no-jtc-hide-channel")
                  .setLabel("No")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
            ephemeral: true,
          });
          const collector7 =
            interaction.channel.createMessageComponentCollector({
              componentType: ComponentType.Button,
              time: 120000,
            });
          collector7.on("collect", async (collected) => {
            if (collected.customId == "yes-jtc-hide-channel") {
              collected.guild.channels.cache
                .get(userLimitIsFound5.channels)
                .permissionOverwrites.edit(collected.guild.roles.everyone.id, {
                  ViewChannel: false,
                });
              var size2 = Object.keys(userLimitIsFound5.users).length;

              const jtcusers2 = userLimitIsFound5.users.map((a) => ({
                id: a.id,
                added: a.added === false,
              }));
              var size2 = Object.keys(userLimitIsFound5.users).length;
              if (jtcusers2) {
                for (let i = 0; i < size2; i++) {
                  const { guild } = interaction;

                  guild.members
                    .fetch(`${jtcusers2[i].id}`)
                    .then((user) => {
                      if (
                        !interaction.guild.channels.cache
                          .get(`${userLimitIsFound5.channels}`)
                          .permissionsFor(`${user.id}`)
                          .has("Connect")
                      ) {
                        collected.guild.channels.cache
                          .get(userLimitIsFound5.channels)
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
              await collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setColor("#800000")
                    .setTitle("Hided your custom vc")
                    .setDescription(
                      `You have successfully hided your custom vc to everyone except for the users you have added yourself\n\n**Vc Information**\n**Name**: <#${userLimitIsFound5.channels}>\n**ID**: ${userLimitIsFound5.channels}\n**User Limit**: ${userLimitIsFound5.userLimit}`
                    ),
                ],
                components: [],
              });
              return;
            } else if (collected.customId == "no-jtc-hide-channel") {
              collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Process cancelled")
                    .setDescription(
                      `Successfully cancelled the hiding of your custom vc`
                    ),
                ],
                components: [],
              });
            }
          });
          break;
        case "jtc-unhide-button":
          const userLimitIsFound6 = setupData.JTCInfo.find((element) => {
            if (element.owner === interaction.user.id) {
              return element;
            }
          });
          if (isFound === false)
            return interaction.reply({
              content: "You dont own any custom vc yet",
              ephemeral: true,
            });
          if (
            interaction.guild.channels.cache
              .get(userLimitIsFound6.channels)
              .permissionsFor(interaction.guild.roles.everyone.id)
              .has("ViewChannel")
          )
            return interaction.reply({
              content: "Your channel is already unhided to everyone",
              ephemeral: true,
            });
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setTitle("Unhide your custom vc")
                .setDescription(
                  `You are going to hide your custom vc for everyone\n\n**Vc Information**\n**Name**: <#${userLimitIsFound6.channels}>\n**ID**: ${userLimitIsFound6.channels}\n**User Limit**: ${userLimitIsFound6.userLimit}\nClick the **Yes** button below to start the process and press **No** to stop the process`
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("yes-jtc-unhide-channel")
                  .setLabel("Yes")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("no-jtc-unhide-channel")
                  .setLabel("No")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
            ephemeral: true,
          });
          const collector8 =
            interaction.channel.createMessageComponentCollector({
              componentType: ComponentType.Button,
              time: 120000,
            });
          collector8.on("collect", async (collected) => {
            if (collected.customId == "yes-jtc-unhide-channel") {
              collected.guild.channels.cache
                .get(userLimitIsFound6.channels)
                .permissionOverwrites.edit(collected.guild.roles.everyone.id, {
                  ViewChannel: true,
                });
              const jtcusers = userLimitIsFound6.users.map((a) => ({
                id: a.id,
                added: a.added === false,
              }));
              var size = Object.keys(userLimitIsFound6.users).length;
              if (jtcusers) {
                for (let i = 0; i < size; i++) {
                  const { guild } = interaction;
                  guild.members
                    .fetch(`${jtcusers[i].id}`)
                    .then((user) => {
                      collected.guild.channels.cache
                        .get(`${userLimitIsFound6.channels}`)
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
              collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setColor("#800000")
                    .setTitle("UnHided your custom vc")
                    .setDescription(
                      `You have successfully unhided your custom vc to everyone\n\n**Vc Information**\n**Name**: <#${userLimitIsFound6.channels}>\n**ID**: ${userLimitIsFound6.channels}\n**User Limit**: ${userLimitIsFound6.userLimit}`
                    ),
                ],
                components: [],
              });
              return;
            } else if (collected.customId == "no-jtc-unhide-channel") {
              collected.update({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Process cancelled")
                    .setDescription(
                      `Successfully cancelled the unhiding of your custom vc`
                    ),
                ],
                components: [],
              });
            }
          });
          break;
      }
    }
  },
};
