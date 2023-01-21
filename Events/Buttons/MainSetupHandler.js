const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, channel, message, member, guild } = interaction;
    if (!interaction.isButton()) return;
    if (
      ![
        "JTCSetupB",
        "JTCResetup",
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
        "MainSetupMenu",
      ].includes(customId)
    )
      return;
    const setupData = await setupDB.findOne({ GuildID: guild.id });
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
    if (["JTCSetupB", "JTCResetup"].includes(customId)) {
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
                    channel.send({
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
                      });
                  });
                interaction.update({
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
                const MainMsg = await msg.edit({
                  fetchReply: true,
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("__Main Setup Menu__")
                      .setAuthor({
                        name: member.user.tag,
                        iconURL: member.user.displayAvatarURL(),
                      })
                      .setDescription(
                        `This is the Main Setup Menu, you can choose what you want for your server and leave things that you don't need!
                      
                      Simply go ahead and click on the Buttons and Complete them, when you have setup the things you want, you can just click on the Confirm Button!`
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
                        .setStyle(ButtonStyle.Danger)
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
                    channel.send({
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
                            .find((r) => r.id === owner.channels)
                            .setParent(categoryName.id, {
                              lockPermissions: false,
                            });
                        });
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { Resetting: false }
                        );
                      });
                  });
              });

            await wait(3000);
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
            await wait(5000);
            const MainMsg = await msg.edit({
              fetchReply: true,
              embeds: [
                new EmbedBuilder()
                  .setTitle("__Main Setup Menu__")
                  .setAuthor({
                    name: member.user.tag,
                    iconURL: member.user.displayAvatarURL(),
                  })
                  .setDescription(
                    `This is the Main Setup Menu, you can choose what you want for your server and leave things that you don't need!
                    
                    Simply go ahead and click on the Buttons and Complete them, when you have setup the things you want, you can just click on the Confirm Button!`
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
                    .setStyle(ButtonStyle.Danger)
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
      }
      // Log Setup
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
    } else if (customId === "MainSetupMenu") {
      const MainMsg = await interaction.update({
        fetchReply: true,
        embeds: [
          new EmbedBuilder()
            .setTitle("__Main Setup Menu__")
            .setAuthor({
              name: member.user.tag,
              iconURL: member.user.displayAvatarURL(),
            })
            .setDescription(
              `This is the Main Setup Menu, you can choose what you want for your server and leave things that you don't need!
              
              Simply go ahead and click on the Buttons and Complete them, when you have setup the things you want, you can just click on the Confirm Button!`
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
              .setStyle(ButtonStyle.Danger)
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
  },
};
