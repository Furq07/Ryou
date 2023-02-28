const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  RoleSelectMenuBuilder,
  ChannelSelectMenuBuilder,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const captchaDB = require("../../src/models/captchaDB");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, channel, message, member, guild } = interaction;
    if (!interaction.isButton()) return;
    if (
      ![
        "CommunityRole",
        "StaffRole",
        "AdminRole",
        "CommunityRoleFirst",
        "StaffRoleFirst",
        "AdminRoleFirst",
        "JTCSetupB",
        "JTCResetup",
        "LogSettingsSetup",
        "LogChannelIDSetup",
        "LogChannelIDSetupMain",
        "LogChannelCreateSetup",
        "LogChannelDeleteSetup",
        "LogVCJoinSetup",
        "LogVCLeaveSetup",
        "LogChannelUpdateSetup",
        "LogBanSetup",
        "LogUnbanSetup",
        "LogKickUserSetup",
        "LogUpdateUserSetup",
        "LogInviteCreateSetup",
        "LogMessageDeleteSetup",
        "LogMessageUpdateSetup",
        "LogRoleCreateSetup",
        "LogRoleDeleteSetup",
        "LogRoleUpdateSetup",
        "VerificationModeSetup",
        "VerificationSetupCreate",
        "VerificationDescSetup",
      ].includes(customId)
    )
      return;
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    const msg = await channel.messages.fetch(message.id);
    const data = msg.components[0];
    const newActionRow = ActionRowBuilder.from(data);
    const msgEmbed = msg.embeds[0];
    const author = msgEmbed.author.name;
    if (author !== member.user.tag)
      return interaction.reply({
        content: `These Buttons aren't for You!`,
        ephemeral: true,
      });

    if (
      [
        "CommunityRole",
        "StaffRole",
        "AdminRole",
        "CommunityRoleFirst",
        "StaffRoleFirst",
        "AdminRoleFirst",
      ].includes(customId)
    ) {
      switch (customId) {
        case "CommunityRole":
          newActionRow.components[0].setDisabled(true);
          newActionRow.components[1].setDisabled(true);
          newActionRow.components[2].setDisabled(true);
          interaction.update({
            components: [
              newActionRow,
              new ActionRowBuilder().addComponents(
                new RoleSelectMenuBuilder()
                  .setCustomId("CommunityRoleMenu")
                  .setPlaceholder("Choose the Community Role!")
              ),
            ],
          });
          break;
        case "StaffRole":
          newActionRow.components[0].setDisabled(true);
          newActionRow.components[1].setDisabled(true);
          newActionRow.components[2].setDisabled(true);
          interaction.update({
            components: [
              newActionRow,
              new ActionRowBuilder().addComponents(
                new RoleSelectMenuBuilder()
                  .setCustomId("StaffRoleMenu")
                  .setPlaceholder("Choose the Staff Role!")
              ),
            ],
          });

          break;
        case "AdminRole":
          newActionRow.components[0].setDisabled(true);
          newActionRow.components[1].setDisabled(true);
          newActionRow.components[2].setDisabled(true);
          interaction.update({
            components: [
              newActionRow,
              new ActionRowBuilder().addComponents(
                new RoleSelectMenuBuilder()
                  .setCustomId("AdminRoleMenu")
                  .setPlaceholder("Choose the Admin Role!")
              ),
            ],
          });
          break;
        case "CommunityRoleFirst":
          newActionRow.components[0].setDisabled(true);
          newActionRow.components[1].setDisabled(true);
          newActionRow.components[2].setDisabled(true);
          interaction.update({
            components: [
              newActionRow,
              new ActionRowBuilder().addComponents(
                new RoleSelectMenuBuilder()
                  .setCustomId("CommunityRoleMenuFirst")
                  .setPlaceholder("Choose the Community Role!")
              ),
            ],
          });
          break;
        case "StaffRoleFirst":
          newActionRow.components[0].setDisabled(true);
          newActionRow.components[1].setDisabled(true);
          newActionRow.components[2].setDisabled(true);
          interaction.update({
            components: [
              newActionRow,
              new ActionRowBuilder().addComponents(
                new RoleSelectMenuBuilder()
                  .setCustomId("StaffRoleMenuFirst")
                  .setPlaceholder("Choose the Staff Role!")
              ),
            ],
          });

          break;
        case "AdminRoleFirst":
          newActionRow.components[0].setDisabled(true);
          newActionRow.components[1].setDisabled(true);
          newActionRow.components[2].setDisabled(true);
          interaction.update({
            components: [
              newActionRow,
              new ActionRowBuilder().addComponents(
                new RoleSelectMenuBuilder()
                  .setCustomId("AdminRoleMenuFirst")
                  .setPlaceholder("Choose the Admin Role!")
              ),
            ],
          });
          break;
      }
    } else if (["JTCSetupB", "JTCResetup"].includes(customId)) {
      switch (customId) {
        case "JTCSetupB":
          {
            guild.channels
              .create({
                name: "JTC VCs",
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                  {
                    id: guild.roles.everyone.id,
                    allow: [
                      PermissionFlagsBits.Connect,
                      PermissionFlagsBits.Speak,
                      PermissionFlagsBits.ViewChannel,
                    ],
                  },
                ],
              })
              .then(async (categoryName) => {
                guild.channels
                  .create({
                    name: "jtc-settings",
                    type: ChannelType.GuildText,
                    parent: categoryName,
                    permissionOverwrites: [
                      {
                        id: guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.SendMessages],
                        allow: [PermissionFlagsBits.ViewChannel],
                      },
                    ],
                  })
                  .then(async (channel) => {
                    await setupDB.findOneAndUpdate(
                      { GuildID: guild.id },
                      { JTCSettingID: channel.id }
                    );
                    channel
                      .send({
                        embeds: [
                          new EmbedBuilder()
                            .setColor("#800000")
                            .setTitle("Join to Create Settings")
                            .setDescription(
                              "You can manage your Custom VCs Using the Buttons Below!"
                            ),
                        ],
                        components: [
                          new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                              .setCustomId("jtc-delete-vc-button")
                              .setLabel("Delete VC")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-rename-vc-button")
                              .setLabel("Rename VC")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-user-limit-button")
                              .setLabel("User Limit")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-lock-channel-button")
                              .setLabel("Lock VC")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-unlock-channel-button")
                              .setLabel("Unlock VC")
                              .setStyle(ButtonStyle.Primary)
                          ),
                          new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                              .setCustomId("jtc-add-user-button")
                              .setLabel("Add User")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-remove-user-button")
                              .setLabel("Remove User")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-hide-button")
                              .setLabel("Hide VC")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-unhide-button")
                              .setLabel("Unhide VC")
                              .setStyle(ButtonStyle.Primary)
                          ),
                        ],
                      })
                      .then(async (message) => {
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { JTCSettingMessageID: message.id }
                        );
                      });
                    guild.channels
                      .create({
                        name: `Join to Create`,
                        type: ChannelType.GuildVoice,
                        parent: categoryName,
                        userLimit: 1,
                      })
                      .then(async (channel) => {
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { JTCChannelID: channel.id }
                        );
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { JTCCategoryID: categoryName.id }
                        );
                        await interaction.update({
                          embeds: [
                            new EmbedBuilder()
                              .setTitle("JTC Setup Complete!")
                              .setColor("#800000")
                              .setAuthor({
                                name: member.user.tag,
                                iconURL: member.user.displayAvatarURL(),
                              })
                              .setDescription(
                                "JTC has been setup You can go ahead and Enjoy it!"
                              )
                              .setFooter({
                                text: "Ryou - Utility",
                                iconURL: client.user.displayAvatarURL(),
                              }),
                          ],
                          components: [],
                        });
                        await wait(3000);
                        const MainMsg = await msg.edit({
                          fetchReply: true,
                          embeds: [
                            new EmbedBuilder()
                              .setTitle("__Settings Menu__")
                              .setAuthor({
                                name: member.user.tag,
                                iconURL: member.user.displayAvatarURL(),
                              })
                              .setDescription(
                                `This is the Settings Menu, you can choose what you want for your server,
                              and leave things that you don't need!
                              
                              Simply go ahead and click on the Buttons and Complete them,
                              when you have setup the things you want,
                              you can just click on the Confirm Button!`
                              )
                              .setFooter({
                                text: "Ryou - Utility",
                                iconURL: client.user.displayAvatarURL(),
                              }),
                          ],
                          components: [
                            new ActionRowBuilder().addComponents(
                              new ButtonBuilder()
                                .setCustomId("JTCSetup")
                                .setLabel("Join to Create")
                                .setStyle(ButtonStyle.Danger),
                              new ButtonBuilder()
                                .setCustomId("VerificationSetup")
                                .setLabel("Verification")
                                .setStyle(ButtonStyle.Danger),
                              new ButtonBuilder()
                                .setCustomId("LogsSetup")
                                .setLabel("Logs")
                                .setStyle(ButtonStyle.Danger),
                              new ButtonBuilder()
                                .setCustomId("TicketSetup")
                                .setLabel("Ticket")
                                .setStyle(ButtonStyle.Danger),
                              new ButtonBuilder()
                                .setCustomId("DefaultRolesSetup")
                                .setLabel("Default Roles")
                                .setStyle(ButtonStyle.Primary)
                            ),
                          ],
                        });
                        await setupDB
                          .findOne({ GuildID: guild.id })
                          .then((DB) => {
                            const data = MainMsg.components[0];
                            const newActionRow = ActionRowBuilder.from(data);
                            if (DB.JTCChannelID) {
                              newActionRow.components[0].setStyle(
                                ButtonStyle.Success
                              );
                            }
                            if (DB.VerificationChannelID) {
                              newActionRow.components[1].setStyle(
                                ButtonStyle.Success
                              );
                            }
                            if (DB.LogChannelID) {
                              newActionRow.components[2].setStyle(
                                ButtonStyle.Success
                              );
                            }
                            if (DB.TicketParentID) {
                              newActionRow.components[3].setStyle(
                                ButtonStyle.Success
                              );
                            }
                            MainMsg.edit({
                              components: [newActionRow],
                            });
                          });
                      });
                  });
              });
          }
          break;
        case "JTCResetup":
          {
            // Future Purposes:
            // const channels = serverID?.channels
            //   ? JSON.parse(JSON.stringify(serverID.channels)).guild.channels
            //   : [];
            await setupDB.findOneAndUpdate(
              { GuildID: guild.id },
              { Resetting: true }
            );
            const jtcCategory = guild.channels.cache.get(
              setupData.JTCCategoryID
            );
            const jtcSettingChannel = guild.channels.cache.get(
              setupData.JTCSettingID
            );
            const jtcChannel = guild.channels.cache.get(setupData.JTCChannelID);
            await interaction.update({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Resetting Up the JTC")
                  .setColor("#800000")
                  .setAuthor({
                    name: member.user.tag,
                    iconURL: member.user.displayAvatarURL(),
                  })
                  .setDescription("Please wait a Moment!")
                  .setFooter({
                    text: "Ryou - Utility",
                    iconURL: client.user.displayAvatarURL(),
                  }),
              ],
              components: [],
            });
            // await setupDB.updateMany(
            //   {
            //     GuildID: guild.id,
            //   },
            //   { $pull: { JTCInfo: { channels: owner.channels } } }
            // );

            if (jtcSettingChannel) await jtcSettingChannel.delete();
            if (jtcChannel) await jtcChannel.delete();
            if (jtcCategory) await jtcCategory.delete();

            await guild.channels
              .create({
                name: "JTC VCs",
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                  {
                    id: guild.roles.everyone.id,
                    allow: [
                      PermissionFlagsBits.Connect,
                      PermissionFlagsBits.Speak,
                      PermissionFlagsBits.ViewChannel,
                    ],
                  },
                ],
              })
              .then(async (categoryName) => {
                await guild.channels
                  .create({
                    name: "jtc-settings",
                    type: ChannelType.GuildText,
                    parent: categoryName,
                    permissionOverwrites: [
                      {
                        id: guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.SendMessages],
                        allow: [PermissionFlagsBits.ViewChannel],
                      },
                    ],
                  })
                  .then(async (channel) => {
                    await setupDB.findOneAndUpdate(
                      { GuildID: guild.id },
                      { JTCSettingID: channel.id }
                    );
                    channel
                      .send({
                        embeds: [
                          new EmbedBuilder()
                            .setColor("#800000")
                            .setTitle("Join to Create Settings")
                            .setDescription(
                              "You can manage your Custom VCs Using the Buttons Below!"
                            ),
                        ],
                        components: [
                          new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                              .setCustomId("jtc-delete-vc-button")
                              .setLabel("Delete VC")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-rename-vc-button")
                              .setLabel("Rename VC")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-user-limit-button")
                              .setLabel("User Limit")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-lock-channel-button")
                              .setLabel("Lock VC")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-unlock-channel-button")
                              .setLabel("Unlock VC")
                              .setStyle(ButtonStyle.Primary)
                          ),
                          new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                              .setCustomId("jtc-add-user-button")
                              .setLabel("Add User")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-remove-user-button")
                              .setLabel("Remove User")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-hide-button")
                              .setLabel("Hide VC")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("jtc-unhide-button")
                              .setLabel("Unhide VC")
                              .setStyle(ButtonStyle.Primary)
                          ),
                        ],
                      })
                      .then(async (message) => {
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { JTCSettingMessageID: message.id }
                        );
                      });
                    await guild.channels
                      .create({
                        name: `Join to Create`,
                        type: ChannelType.GuildVoice,
                        parent: categoryName,
                        userLimit: 1,
                      })
                      .then(async (channel) => {
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { JTCChannelID: channel.id }
                        );
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { JTCCategoryID: categoryName.id }
                        );
                        await channel.setPosition(2);
                        setupData.JTCInfo.forEach(async (owner) => {
                          await guild.channels.cache
                            .find((r) => r.id === owner.channel)
                            .setParent(categoryName.id, {
                              lockPermissions: false,
                            });
                        });
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { Resetting: false }
                        );
                        msg.edit({
                          embeds: [
                            new EmbedBuilder()
                              .setTitle("JTC Resetup Complete!")
                              .setColor("#800000")
                              .setAuthor({
                                name: member.user.tag,
                                iconURL: member.user.displayAvatarURL(),
                              })
                              .setDescription(
                                "JTC has been Resetup You can go ahead and Enjoy it!"
                              )
                              .setFooter({
                                text: "Ryou - Utility",
                                iconURL: client.user.displayAvatarURL(),
                              }),
                          ],
                          components: [],
                        });
                        await wait(3000);
                        const MainMsg = await msg.edit({
                          fetchReply: true,
                          embeds: [
                            new EmbedBuilder()
                              .setTitle("__Settings Menu__")
                              .setAuthor({
                                name: member.user.tag,
                                iconURL: member.user.displayAvatarURL(),
                              })
                              .setDescription(
                                `This is the Settings Menu, you can choose what you want for your server,
                              and leave things that you don't need!
                              
                              Simply go ahead and click on the Buttons and Complete them,
                              when you have setup the things you want,
                              you can just click on the Confirm Button!`
                              )
                              .setFooter({
                                text: "Ryou - Utility",
                                iconURL: client.user.displayAvatarURL(),
                              }),
                          ],
                          components: [
                            new ActionRowBuilder().addComponents(
                              new ButtonBuilder()
                                .setCustomId("JTCSetup")
                                .setLabel("Join to Create")
                                .setStyle(ButtonStyle.Danger),
                              new ButtonBuilder()
                                .setCustomId("VerificationSetup")
                                .setLabel("Verification")
                                .setStyle(ButtonStyle.Danger),
                              new ButtonBuilder()
                                .setCustomId("LogsSetup")
                                .setLabel("Logs")
                                .setStyle(ButtonStyle.Danger),
                              new ButtonBuilder()
                                .setCustomId("TicketSetup")
                                .setLabel("Ticket")
                                .setStyle(ButtonStyle.Danger),
                              new ButtonBuilder()
                                .setCustomId("DefaultRolesSetup")
                                .setLabel("Default Roles")
                                .setStyle(ButtonStyle.Primary)
                            ),
                          ],
                        });
                        await setupDB
                          .findOne({ GuildID: guild.id })
                          .then((DB) => {
                            const data = MainMsg.components[0];
                            const newActionRow = ActionRowBuilder.from(data);
                            if (DB.JTCChannelID) {
                              newActionRow.components[0].setStyle(
                                ButtonStyle.Success
                              );
                            }
                            if (DB.VerificationChannelID) {
                              newActionRow.components[1].setStyle(
                                ButtonStyle.Success
                              );
                            }
                            if (DB.LogChannelID) {
                              newActionRow.components[2].setStyle(
                                ButtonStyle.Success
                              );
                            }
                            if (DB.TicketParentID) {
                              newActionRow.components[3].setStyle(
                                ButtonStyle.Success
                              );
                            }
                            MainMsg.edit({
                              components: [newActionRow],
                            });
                          });
                      });
                  });
              });
          }
          break;
      }
      // Log Setup
    } else if (
      [
        "LogSettingsSetup",
        "LogChannelIDSetup",
        "LogChannelIDSetupMain",
      ].includes(customId)
    ) {
      switch (customId) {
        case "LogSettingsSetup":
          const LogMsg = await interaction.update({
            fetchReply: true,
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setAuthor({
                  name: member.user.tag,
                  iconURL: member.user.displayAvatarURL(),
                })
                .setTitle("__Logs Setup Menu__")
                .setFooter({
                  text: "Ryou - Utility",
                  iconURL: client.user.displayAvatarURL(),
                })
                .setDescription(
                  `Just click on the Buttons below and Turn off or On the things you want!`
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("LogChannelCreateSetup")
                  .setLabel("Create Channel")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogChannelDeleteSetup")
                  .setLabel("Delete Channel")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogVCJoinSetup")
                  .setLabel("Join VC")
                  .setStyle(ButtonStyle.Danger)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("LogVCLeaveSetup")
                  .setLabel("Leave VC")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogChannelUpdateSetup")
                  .setLabel("Channel Update")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogBanSetup")
                  .setLabel("Ban User")
                  .setStyle(ButtonStyle.Danger)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("LogUnbanSetup")
                  .setLabel("Unban User")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogKickUserSetup")
                  .setLabel("Kick User")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogUpdateUserSetup")
                  .setLabel("User Update")
                  .setStyle(ButtonStyle.Danger)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("LogInviteCreateSetup")
                  .setLabel("Invite Create")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogMessageDeleteSetup")
                  .setLabel("Message Delete")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogMessageUpdateSetup")
                  .setLabel("Update Message")
                  .setStyle(ButtonStyle.Danger)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("LogRoleCreateSetup")
                  .setLabel("Create Role")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogRoleDeleteSetup")
                  .setLabel("Delete Role")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogRoleUpdateSetup")
                  .setLabel("Update Role")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("MainSetupMenu")
                  .setEmoji("⏩")
                  .setLabel("Back")
                  .setStyle(ButtonStyle.Primary)
              ),
            ],
          });
          const data = LogMsg.components[0];
          const data2 = LogMsg.components[1];
          const data3 = LogMsg.components[2];
          const data4 = LogMsg.components[3];
          const data5 = LogMsg.components[4];
          const newActionRow = ActionRowBuilder.from(data);
          const newActionRow2 = ActionRowBuilder.from(data2);
          const newActionRow3 = ActionRowBuilder.from(data3);
          const newActionRow4 = ActionRowBuilder.from(data4);
          const newActionRow5 = ActionRowBuilder.from(data5);
          const ButtonIds = [
            { name: "LogChannelCreateSetup", ID: 0 },
            { name: "LogChannelDeleteSetup", ID: 1 },
            { name: "LogVCJoinSetup", ID: 2 },
            { name: "LogVCLeaveSetup", ID: 0 },
            { name: "LogChannelUpdateSetup", ID: 1 },
            { name: "LogBanSetup", ID: 2 },
            { name: "LogUnbanSetup", ID: 0 },
            { name: "LogKickUserSetup", ID: 1 },
            { name: "LogUpdateUserSetup", ID: 2 },
            { name: "LogInviteCreateSetup", ID: 0 },
            { name: "LogMessageDeleteSetup", ID: 1 },
            { name: "LogMessageUpdateSetup", ID: 2 },
            { name: "LogRoleCreateSetup", ID: 0 },
            { name: "LogRoleDeleteSetup", ID: 1 },
            { name: "LogRoleUpdateSetup", ID: 2 },
          ];
          ButtonIds.forEach((element) => {
            const name = element.name;
            const ID = element.ID;
            if (setupData[name] === true) {
              if (
                [
                  "LogChannelCreateSetup",
                  "LogChannelDeleteSetup",
                  "LogVCJoinSetup",
                ].includes(name)
              ) {
                newActionRow.components[ID].setStyle(ButtonStyle.Success);
              } else if (
                [
                  "LogVCLeaveSetup",
                  "LogChannelUpdateSetup",
                  "LogBanSetup",
                ].includes(name)
              ) {
                newActionRow2.components[ID].setStyle(ButtonStyle.Success);
              } else if (
                [
                  "LogUnbanSetup",
                  "LogKickUserSetup",
                  "LogUpdateUserSetup",
                ].includes(name)
              ) {
                newActionRow3.components[ID].setStyle(ButtonStyle.Success);
              } else if (
                [
                  "LogInviteCreateSetup",
                  "LogMessageDeleteSetup",
                  "LogMessageUpdateSetup",
                ].includes(name)
              ) {
                newActionRow4.components[ID].setStyle(ButtonStyle.Success);
              } else if (
                [
                  "LogRoleCreateSetup",
                  "LogRoleDeleteSetup",
                  "LogRoleUpdateSetup",
                ].includes(name)
              ) {
                newActionRow5.components[ID].setStyle(ButtonStyle.Success);
              }
            }
          });
          LogMsg.edit({
            components: [
              newActionRow,
              newActionRow2,
              newActionRow3,
              newActionRow4,
              newActionRow5,
            ],
          });
          break;
        case "LogChannelIDSetup": {
          const data = msg.components[0];
          const newActionRow = ActionRowBuilder.from(data);
          newActionRow.components[0].setDisabled(true);
          interaction.update({
            components: [
              newActionRow,
              new ActionRowBuilder().addComponents(
                new ChannelSelectMenuBuilder()
                  .setCustomId("LogChannelMenu")
                  .setPlaceholder("Choose the Logs Channel!")
              ),
            ],
          });
        }
        case "LogChannelIDSetupMain":
          {
            const data = msg.components[0];
            const newActionRow = ActionRowBuilder.from(data);
            newActionRow.components[0].setDisabled(true);
            interaction.update({
              components: [
                newActionRow,
                new ActionRowBuilder().addComponents(
                  new ChannelSelectMenuBuilder()
                    .setCustomId("LogChannelMenuMain")
                    .setPlaceholder("Choose the Logs Channel!")
                ),
              ],
            });
          }
          break;
      }
    } else if (
      [
        "LogChannelCreateSetup",
        "LogChannelDeleteSetup",
        "LogVCJoinSetup",
        "LogVCLeaveSetup",
        "LogChannelUpdateSetup",
        "LogBanSetup",
        "LogUnbanSetup",
        "LogKickUserSetup",
        "LogUpdateUserSetup",
        "LogInviteCreateSetup",
        "LogMessageDeleteSetup",
        "LogMessageUpdateSetup",
        "LogRoleCreateSetup",
        "LogRoleDeleteSetup",
        "LogRoleUpdateSetup",
      ].includes(customId)
    ) {
      const data2 = msg.components[1];
      const data3 = msg.components[2];
      const data4 = msg.components[3];
      const data5 = msg.components[4];
      const newActionRow2 = ActionRowBuilder.from(data2);
      const newActionRow3 = ActionRowBuilder.from(data3);
      const newActionRow4 = ActionRowBuilder.from(data4);
      const newActionRow5 = ActionRowBuilder.from(data5);
      let Number;
      if (!setupData[customId] || setupData[customId] === false) {
        if (
          customId === "LogChannelCreateSetup" ||
          customId === "LogChannelDeleteSetup" ||
          customId === "LogVCJoinSetup"
        ) {
          if (customId === "LogChannelCreateSetup") Number = 0;
          if (customId === "LogChannelDeleteSetup") Number = 1;
          if (customId === "LogVCJoinSetup") Number = 2;
          newActionRow.components[Number].setStyle(ButtonStyle.Success);
        } else if (
          customId === "LogVCLeaveSetup" ||
          customId === "LogChannelUpdateSetup" ||
          customId === "LogBanSetup"
        ) {
          if (customId === "LogVCLeaveSetup") Number = 0;
          if (customId === "LogChannelUpdateSetup") Number = 1;
          if (customId === "LogBanSetup") Number = 2;
          newActionRow2.components[Number].setStyle(ButtonStyle.Success);
        } else if (
          customId === "LogUnbanSetup" ||
          customId === "LogKickUserSetup" ||
          customId === "LogUpdateUserSetup"
        ) {
          if (customId === "LogUnbanSetup") Number = 0;
          if (customId === "LogKickUserSetup") Number = 1;
          if (customId === "LogUpdateUserSetup") Number = 2;
          newActionRow3.components[Number].setStyle(ButtonStyle.Success);
        } else if (
          customId === "LogInviteCreateSetup" ||
          customId === "LogMessageDeleteSetup" ||
          customId === "LogMessageUpdateSetup"
        ) {
          if (customId === "LogInviteCreateSetup") Number = 0;
          if (customId === "LogMessageDeleteSetup") Number = 1;
          if (customId === "LogMessageUpdateSetup") Number = 2;
          newActionRow4.components[Number].setStyle(ButtonStyle.Success);
        } else if (
          customId === "LogRoleCreateSetup" ||
          customId === "LogRoleDeleteSetup" ||
          customId === "LogRoleUpdateSetup"
        ) {
          if (customId === "LogRoleCreateSetup") Number = 0;
          if (customId === "LogRoleDeleteSetup") Number = 1;
          if (customId === "LogRoleUpdateSetup") Number = 2;
          newActionRow5.components[Number].setStyle(ButtonStyle.Success);
        }

        await setupDB.findOneAndUpdate(
          { GuildID: guild.id },
          { [customId]: true }
        );

        interaction.update({
          components: [
            newActionRow,
            newActionRow2,
            newActionRow3,
            newActionRow4,
            newActionRow5,
          ],
        });
      } else {
        if (
          customId === "LogChannelCreateSetup" ||
          customId === "LogChannelDeleteSetup" ||
          customId === "LogVCJoinSetup"
        ) {
          if (customId === "LogChannelCreateSetup") Number = 0;
          if (customId === "LogChannelDeleteSetup") Number = 1;
          if (customId === "LogVCJoinSetup") Number = 2;
          newActionRow.components[Number].setStyle(ButtonStyle.Danger);
        } else if (
          customId === "LogVCLeaveSetup" ||
          customId === "LogChannelUpdateSetup" ||
          customId === "LogBanSetup"
        ) {
          if (customId === "LogVCLeaveSetup") Number = 0;
          if (customId === "LogChannelUpdateSetup") Number = 1;
          if (customId === "LogBanSetup") Number = 2;
          newActionRow2.components[Number].setStyle(ButtonStyle.Danger);
        } else if (
          customId === "LogUnbanSetup" ||
          customId === "LogKickUserSetup" ||
          customId === "LogUpdateUserSetup"
        ) {
          if (customId === "LogUnbanSetup") Number = 0;
          if (customId === "LogKickUserSetup") Number = 1;
          if (customId === "LogUpdateUserSetup") Number = 2;
          newActionRow3.components[Number].setStyle(ButtonStyle.Danger);
        } else if (
          customId === "LogInviteCreateSetup" ||
          customId === "LogMessageDeleteSetup" ||
          customId === "LogMessageUpdateSetup"
        ) {
          if (customId === "LogInviteCreateSetup") Number = 0;
          if (customId === "LogMessageDeleteSetup") Number = 1;
          if (customId === "LogMessageUpdateSetup") Number = 2;
          newActionRow4.components[Number].setStyle(ButtonStyle.Danger);
        } else if (
          customId === "LogRoleCreateSetup" ||
          customId === "LogRoleDeleteSetup" ||
          customId === "LogRoleUpdateSetup"
        ) {
          if (customId === "LogRoleCreateSetup") Number = 0;
          if (customId === "LogRoleDeleteSetup") Number = 1;
          if (customId === "LogRoleUpdateSetup") Number = 2;
          newActionRow5.components[Number].setStyle(ButtonStyle.Danger);
        }

        await setupDB.findOneAndUpdate(
          { GuildID: guild.id },
          { [customId]: false }
        );

        interaction.update({
          components: [
            newActionRow,
            newActionRow2,
            newActionRow3,
            newActionRow4,
            newActionRow5,
          ],
        });
      }
    } else if (
      ["VerificationModeSetup", "VerificationSetupCreate"].includes(customId)
    ) {
      switch (customId) {
        case "VerificationSetupCreate":
          {
            guild.channels
              .create({
                name: "Verification",
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                  {
                    id: guild.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                  },
                  {
                    id: setupData.CommunityRoleID,
                    deny: [
                      PermissionFlagsBits.SendMessages,
                      PermissionFlagsBits.ViewChannel,
                    ],
                  },
                ],
              })
              .then(async (category) => {
                guild.channels
                  .create({
                    name: "verify",
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                      {
                        id: guild.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                      },
                      {
                        id: setupData.CommunityRoleID,
                        deny: [
                          PermissionFlagsBits.SendMessages,
                          PermissionFlagsBits.ViewChannel,
                        ],
                      },
                    ],
                  })
                  .then(async (verifyChannel) => {
                    verifyChannel
                      .send({
                        embeds: [
                          new EmbedBuilder()
                            .setColor("#800000")
                            .setTitle(`${guild.name} | Verfication`)
                            .setDescription(
                              `In order to get access in \`${guild.name}\`, verify yourself using \n**Verify** Button!`
                            )
                            .setFooter({
                              text: "Ryou - Verification",
                              iconURL: client.user.displayAvatarURL(),
                            }),
                        ],
                        components: [
                          new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                              .setCustomId("VerifyButton")
                              .setLabel("Verify")
                              .setEmoji("✅")
                              .setStyle(ButtonStyle.Success)
                          ),
                        ],
                      })
                      .then(async (message) => {
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { VerificationMessageID: message.id }
                        );
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { VerificationChannelID: verifyChannel.id }
                        );
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { VerificationCategoryID: category.id }
                        );
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { VerificationMode: false }
                        );
                      });
                  });
              });
            interaction.update({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Verification Setup Complete!")
                  .setColor("#800000")
                  .setAuthor({
                    name: member.user.tag,
                    iconURL: member.user.displayAvatarURL(),
                  })
                  .setDescription(
                    `Verification has been Setuped!
                      You can check it out!`
                  )
                  .setFooter({
                    text: "Ryou - Utility",
                    iconURL: client.user.displayAvatarURL(),
                  }),
              ],
              components: [],
            });
            await wait(5000);
            const MainMsg = await msg.edit({
              fetchReply: true,
              embeds: [
                new EmbedBuilder()
                  .setTitle("__Settings Menu__")
                  .setAuthor({
                    name: member.user.tag,
                    iconURL: member.user.displayAvatarURL(),
                  })
                  .setDescription(
                    `This is the Settings Menu, you can choose what you want for your server,
                  and leave things that you don't need!
                  
                  Simply go ahead and click on the Buttons and Complete them,
                  when you have setup the things you want,
                  you can just click on the Confirm Button!`
                  )
                  .setFooter({
                    text: "Ryou - Utility",
                    iconURL: client.user.displayAvatarURL(),
                  }),
              ],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("JTCSetup")
                    .setLabel("Join to Create")
                    .setStyle(ButtonStyle.Danger),
                  new ButtonBuilder()
                    .setCustomId("VerificationSetup")
                    .setLabel("Verification")
                    .setStyle(ButtonStyle.Danger),
                  new ButtonBuilder()
                    .setCustomId("LogsSetup")
                    .setLabel("Logs")
                    .setStyle(ButtonStyle.Danger),
                  new ButtonBuilder()
                    .setCustomId("TicketSetup")
                    .setLabel("Ticket")
                    .setStyle(ButtonStyle.Danger),
                  new ButtonBuilder()
                    .setCustomId("DefaultRolesSetup")
                    .setLabel("Default Roles")
                    .setStyle(ButtonStyle.Primary)
                ),
              ],
            });
            await setupDB.findOne({ GuildID: guild.id }).then((DB) => {
              const data = MainMsg.components[0];
              const newActionRow = ActionRowBuilder.from(data);
              if (DB.JTCChannelID) {
                newActionRow.components[0].setStyle(ButtonStyle.Success);
              }
              if (DB.VerificationChannelID) {
                newActionRow.components[1].setStyle(ButtonStyle.Success);
              }
              if (DB.LogChannelID) {
                newActionRow.components[2].setStyle(ButtonStyle.Success);
              }
              if (DB.TicketParentID) {
                newActionRow.components[3].setStyle(ButtonStyle.Success);
              }
              MainMsg.edit({
                components: [newActionRow],
              });
            });
          }
          break;
        case "VerificationModeSetup":
          if (setupData.VerificationMode === false) {
            newActionRow.components[0]
              .setLabel("Mode: Captcha")
              .setStyle(ButtonStyle.Success);
            await setupDB.findOneAndUpdate(
              { GuildID: guild.id },
              { VerificationMode: true }
            );
            if (!captchaData) {
              new captchaDB({
                GuildID: guild.id,
                Captchas: [],
              }).save();
            }
          } else {
            newActionRow.components[0]
              .setLabel("Mode: Normal")
              .setStyle(ButtonStyle.Success);
            await setupDB.findOneAndUpdate(
              { GuildID: guild.id },
              { VerificationMode: false }
            );
            if (captchaData) {
              await captchaDB.deleteOne({ GuildID: guild.id });
            }
          }
          interaction.update({ components: [newActionRow] });
          break;
      }
    } else if (["VerificationDescSetup"].includes(customId)) {
      const VerificationDescModal = new ModalBuilder()
        .setCustomId("VerificationDescModal")
        .setTitle("Enter Description For Embed:");
      const VerificationDescInput = new TextInputBuilder()
        .setCustomId("VerificationDescInput")
        .setLabel("Enter the Description Below:")
        .setRequired(true)
        .setPlaceholder(
          "This is Verification Section, Click on the Button Below to Unlock the Server!"
        )
        .setStyle(TextInputStyle.Paragraph);
      VerificationDescModal.addComponents(
        new ActionRowBuilder().addComponents(VerificationDescInput)
      );
      await interaction.showModal(VerificationDescModal);
    }
  },
};
