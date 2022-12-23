const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
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
    const msgEmbed = msg.embeds[0];
    const author = msgEmbed.author.name;
    if (author !== member.user.tag)
      return interaction.reply({
        content: `These Buttons aren't for You!`,
        ephemeral: true,
      });
    // Startup Setup Menu
    if (["CommunityRole", "StaffRole", "AdminRole"].includes(customId)) {
      switch (customId) {
        case "CommunityRole":
          const CommunityModal = new ModalBuilder()
            .setCustomId("CommunityModal")
            .setTitle("Enter Community Role ID:");
          const CommunityRoleInput = new TextInputBuilder()
            .setCustomId("CommunityRoleInput")
            .setLabel("Enter the Id of Community Role Below:")
            .setRequired(true)
            .setMinLength(15)
            .setMaxLength(30)
            .setPlaceholder("Example: 1008473719599018134")
            .setStyle(TextInputStyle.Short);
          CommunityModal.addComponents(
            new ActionRowBuilder().addComponents(CommunityRoleInput)
          );
          await interaction.showModal(CommunityModal);
          break;
        case "StaffRole":
          const StaffModal = new ModalBuilder()
            .setCustomId("StaffModal")
            .setTitle("Enter Staff Role ID:");
          const StaffRoleInput = new TextInputBuilder()
            .setCustomId("StaffRoleInput")
            .setLabel("Enter the Id of Staff Role Below:")
            .setRequired(true)
            .setMinLength(15)
            .setMaxLength(30)
            .setPlaceholder("Example: 1008848000853999789")
            .setStyle(TextInputStyle.Short);
          StaffModal.addComponents(
            new ActionRowBuilder().addComponents(StaffRoleInput)
          );
          await interaction.showModal(StaffModal);
          break;
        case "AdminRole":
          const AdminModal = new ModalBuilder()
            .setCustomId("AdminModal")
            .setTitle("Enter Admin Role ID:");
          const AdminRoleInput = new TextInputBuilder()
            .setCustomId("AdminRoleInput")
            .setLabel("Enter the Id of Admin Role Below:")
            .setRequired(true)
            .setMinLength(15)
            .setMaxLength(30)
            .setPlaceholder("Example: 1008164208363454605")
            .setStyle(TextInputStyle.Short);
          AdminModal.addComponents(
            new ActionRowBuilder().addComponents(AdminRoleInput)
          );

          await interaction.showModal(AdminModal);
          break;
      }
      // Main Setup Menu
    } else if (
      ["JTCSetup", "VerificationSetup", "LogsSetup", "TicketSetup"].includes(
        customId
      )
    ) {
      switch (customId) {
        case "JTCSetup":
          if (setupData.JTCChannelID)
            return msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Wanna Re-Setup?")
                  .setColor("#800000")
                  .setAuthor({
                    name: member.user.tag,
                    iconURL: member.user.displayAvatarURL(),
                  })
                  .setFooter({
                    text: "Ryou - Utility",
                    iconURL: client.user.displayAvatarURL(),
                  })
                  .setDescription(
                    `Join to Create has Already been Setup on this Server,
                  If you wanna Re-Setup it, Click on the Button Below!`
                  ),
              ],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("JTCResetup")
                    .setLabel("Re-Setup")
                    .setEmoji("🔁")
                    .setStyle(ButtonStyle.Success)
                ),
              ],
            });
          msg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setAuthor({
                  name: member.user.tag,
                  iconURL: member.user.displayAvatarURL(),
                })
                .setTitle("Join to Create Setup Menu!")
                .setFooter({
                  text: "Ryou - Utility",
                  iconURL: client.user.displayAvatarURL(),
                })
                .setDescription(
                  `If you wanna Setup Join to Create on your Server,
                  Click on the Button Below!`
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("JTCSetupB")
                  .setLabel("Setup JTC")
                  .setEmoji("✅")
                  .setStyle(ButtonStyle.Primary)
              ),
            ],
          });

          break;
        case "VerificationSetup":
          break;
        case "LogsSetup":
          break;
        case "TicketSetup":
          break;
      }
      // JTC Setup Menu
    } else if (["JTCSetupB", "JTCResetup"].includes(customId)) {
      switch (customId) {
        case "JTCSetupB":
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
            });
          break;
        case "JTCResetup":
          // Future Purposes:
          // const channels = serverID?.channels
          //   ? JSON.parse(JSON.stringify(serverID.channels)).guild.channels
          //   : [];
          const jtcCategory = guild.channels.cache.get(setupData.JTCCategoryID);
          const jtcSettingChannel = guild.channels.cache.get(
            setupData.JTCSettingID
          );
          const jtcChannel = guild.channels.cache.get(setupData.JTCChannelID);
          if (setupData.JTCInfo.length !== 0) {
            await setupData.JTCInfo.forEach(async () => {
              await msg.edit({
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
          break;
      }
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
