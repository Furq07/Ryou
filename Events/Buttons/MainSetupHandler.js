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
                    id: setupData.CommunityRoleID,
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
                        id: setupData.CommunityRoleID,
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
                await wait(2000);
                const embed = new EmbedBuilder()
                  .setTitle("__Opening Main Setup Menu__")
                  .setDescription(
                    `This Embed will be changed to **Main Setup Menu** in \`5 Seconds\`!`
                  )
                  .setThumbnail(client.user.displayAvatarURL())
                  .setFooter({
                    text: "Ryou - Utility",
                    iconURL: client.user.displayAvatarURL(),
                  });
                await wait(1000);
                msg.edit({
                  embeds: [embed],
                  components: [],
                });
                for (let i = 5; i > 0; i--) {
                  await wait(1000);
                  msg.edit({
                    embeds: [
                      embed.setDescription(
                        `This Embed will be changed to **Main Setup Menu** in \`${i} Seconds\`!`
                      ),
                    ],
                  });
                }
                const Buttons = new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("JTCSetup")
                    .setLabel("Join to Create")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Success),
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
                );
                msg.edit({
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
                  components: [Buttons],
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
            const jtcCategory = guild.channels.cache.get(
              setupData.JTCCategoryID
            );
            const jtcSettingChannel = guild.channels.cache.get(
              setupData.JTCSettingID
            );
            const jtcChannel = guild.channels.cache.get(setupData.JTCChannelID);
            if (setupData.JTCInfo.length !== 0) {
              await setupData.JTCInfo.forEach(async () => {
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

                await jtcSettingChannel.delete();
                await jtcChannel.delete();
                await jtcCategory.delete().then(async (err) => {
                  await guild.channels
                    .create({
                      name: "JTC VCs",
                      type: ChannelType.GuildCategory,
                      permissionOverwrites: [
                        {
                          id: setupData.CommunityRoleID,
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
                              id: setupData.CommunityRoleID,
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
                              channel.setPosition(2);
                              setupData.JTCInfo.forEach(async (owner) => {
                                await guild.channels.cache
                                  .find((r) => r.id === owner.channels)
                                  .setParent(categoryName.id, {
                                    lockPermissions: false,
                                  });
                              });
                            });
                        });
                    });
                });
              });
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
              await wait(2000);
              const embed = new EmbedBuilder()
                .setTitle("__Opening Main Setup Menu__")
                .setDescription(
                  `This Embed will be changed to **Main Setup Menu** in \`5 Seconds\`!`
                )
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({
                  text: "Ryou - Utility",
                  iconURL: client.user.displayAvatarURL(),
                });
              await wait(1000);
              msg.edit({
                embeds: [embed],
                components: [],
              });
              for (let i = 5; i > 0; i--) {
                await wait(1000);
                msg.edit({
                  embeds: [
                    embed.setDescription(
                      `This Embed will be changed to **Main Setup Menu** in \`${i} Seconds\`!`
                    ),
                  ],
                });
              }
              const Buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("JTCSetup")
                  .setLabel("Join to Create")
                  .setDisabled(true)
                  .setStyle(ButtonStyle.Success),
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
              );
              msg.edit({
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
                components: [Buttons],
              });
            } else {
              interaction.reply({
                content: `Resetup requires atleast 1 or more than 1 custom vc, To make one just hope into <#${setupData.JTCChannelID}>`,
                ephemeral: true,
              });
            }
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
      let Number;
      if (customId === "LogChannelCreateSetup") Number = 0;
      if (customId === "LogChannelDeleteSetup") Number = 1;
      if (customId === "LogVCJoinSetup") Number = 2;
      if (customId === "LogVCLeaveSetup") Number = 3;
      if (customId === "LogVCUpdateSetup") Number = 4;
      if (customId === "LogBanSetup") Number = 5;
      if (customId === "LogUnbanSetup") Number = 6;
      if (customId === "LogKickUserSetup") Number = 7;
      if (customId === "LogUpdateUserSetup") Number = 8;
      if (customId === "LogInviteCreateSetup") Number = 9;
      if (customId === "LogMessageDeleteSetup") Number = 10;
      if (customId === "LogMessageUpdateSetup") Number = 11;
      if (customId === "LogRoleCreateSetup") Number = 12;
      if (customId === "LogRoleDeleteSetup") Number = 13;
      if (customId === "LogRoleUpdateSetup") Number = 14;

      await setupDB.findOneAndUpdate(
        { GuildID: guild.id },
        { $set: { LogSettings: { [customId]: true } } }
      );
      newActionRow.components[Number].setStyle(ButtonStyle.Success);
      interaction.update({ components: [newActionRow] });
      // Skip Button
    } else if (customId === "SkipSetup") {
      const embed = new EmbedBuilder()
        .setTitle("__Opening Main Setup Menu__")
        .setDescription(
          `This Embed will be changed to **Main Setup Menu** in \`5 Seconds\`!`
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({
          text: "Ryou - Utility",
          iconURL: client.user.displayAvatarURL(),
        });
      await wait(1000);
      interaction.update({
        embeds: [embed],
        components: [],
      });
      for (let i = 5; i > 0; i--) {
        await wait(1000);
        msg.edit({
          embeds: [
            embed.setDescription(
              `This Embed will be changed to **Main Setup Menu** in \`${i} Seconds\`!`
            ),
          ],
        });
      }
      const Buttons = new ActionRowBuilder().addComponents(
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
      );
      msg.edit({
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
        components: [Buttons],
      });
    }
  },
};
