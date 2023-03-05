const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  ChannelSelectMenuBuilder,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { user } = client;
    const { customId, channel, message, member, guild } = interaction;
    if (!interaction.isButton()) return;
    if (
      ![
        "LogChannelSetup",
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
        "VerificationModeSetup",
        "VerificationSetupCreate",
        "LogMessageDeleteSetup",
        "LogMessageUpdateSetup",
        "LogRoleCreateSetup",
        "LogRoleDeleteSetup",
        "LogRoleUpdateSetup",
        "VerificationModeSetup",
        "VerificationSetupCreate",
        "VerificationDescSetup",
        "TicketSetupCreate",
        "TicketSetupTranscript",
        "SettingsMenu",
        "DefaultRolesSetup",
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
        embeds: [new EmbedBuilder().setColor("#800000").setDescription(`Sorry, But this is @${author}'s Command`)],
        ephemeral: true,
      });
    // Log Setup
    if (
      [
        "LogChannelSetup",
        "LogSettingsSetup",
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
      if (customId === "LogChannelSetup") {
        if (setupData.LogChannelID) {
          newActionRow.components[0].setDisabled(true);
          newActionRow.components[1].setDisabled(true);
        } else {
          newActionRow.components[0].setDisabled(true);
        }
        interaction.update({
          components: [
            newActionRow,
            new ActionRowBuilder().addComponents(
              new ChannelSelectMenuBuilder()
                .setCustomId("LogChannelMenu")
                .setPlaceholder("Choose the Log Channel!")
            ),
          ],
        });
      } else if ("LogSettingsSetup" === customId) {
        interaction.update({
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
                .setStyle(
                  setupData.LogChannelCreateSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("LogChannelDeleteSetup")
                .setLabel("Delete Channel")
                .setStyle(
                  setupData.LogChannelDeleteSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("LogVCJoinSetup")
                .setLabel("Join VC")
                .setStyle(
                  setupData.LogVCJoinSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                )
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("LogVCLeaveSetup")
                .setLabel("Leave VC")
                .setStyle(
                  setupData.LogVCLeaveSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("LogChannelUpdateSetup")
                .setLabel("Channel Update")
                .setStyle(
                  setupData.LogChannelUpdateSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("LogBanSetup")
                .setLabel("Ban User")
                .setStyle(
                  setupData.LogBanSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                )
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("LogUnbanSetup")
                .setLabel("Unban User")
                .setStyle(
                  setupData.LogUnbanSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("LogKickUserSetup")
                .setLabel("Kick User")
                .setStyle(
                  setupData.LogKickUserSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("LogUpdateUserSetup")
                .setLabel("User Update")
                .setStyle(
                  setupData.LogUpdateUserSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                )
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("LogInviteCreateSetup")
                .setLabel("Invite Create")
                .setStyle(
                  setupData.LogInviteCreateSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("LogMessageDeleteSetup")
                .setLabel("Message Delete")
                .setStyle(
                  setupData.LogMessageDeleteSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("LogMessageUpdateSetup")
                .setLabel("Update Message")
                .setStyle(
                  setupData.LogMessageUpdateSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                )
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("LogRoleCreateSetup")
                .setLabel("Create Role")
                .setStyle(
                  setupData.LogRoleCreateSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("LogRoleDeleteSetup")
                .setLabel("Delete Role")
                .setStyle(
                  setupData.LogRoleDeleteSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("LogRoleUpdateSetup")
                .setLabel("Update Role")
                .setStyle(
                  setupData.LogRoleUpdateSetup === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("SettingsMenu")
                .setEmoji("⏩")
                .setLabel("Back")
                .setStyle(ButtonStyle.Primary)
            ),
          ],
        });
      } else {
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
                              iconURL: user.displayAvatarURL(),
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
                    iconURL: user.displayAvatarURL(),
                  }),
              ],
              components: [],
            });
            await wait(5000);
            msg.edit({
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
                    .setStyle(
                      setupData.JTCChannelID
                        ? ButtonStyle.Success
                        : ButtonStyle.Danger
                    ),
                  new ButtonBuilder()
                    .setCustomId("VerificationSetup")
                    .setLabel("Verification")
                    .setStyle(
                      setupData.VerificationChannelID
                        ? ButtonStyle.Success
                        : ButtonStyle.Danger
                    ),
                  new ButtonBuilder()
                    .setCustomId("LogsSetup")
                    .setLabel("Logs")
                    .setStyle(
                      setupData.LogChannelID
                        ? ButtonStyle.Success
                        : ButtonStyle.Danger
                    ),
                  new ButtonBuilder()
                    .setCustomId("TicketSetup")
                    .setLabel("Ticket")
                    .setStyle(
                      setupData.TicketParentID
                        ? ButtonStyle.Success
                        : ButtonStyle.Danger
                    ),
                  new ButtonBuilder()
                    .setCustomId("DefaultRolesSetup")
                    .setLabel("Default Roles")
                    .setStyle(ButtonStyle.Primary)
                ),
              ],
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
          } else {
            newActionRow.components[0]
              .setLabel("Mode: Normal")
              .setStyle(ButtonStyle.Success);
            await setupDB.findOneAndUpdate(
              { GuildID: guild.id },
              { VerificationMode: false }
            );
          }
          interaction.update({ components: [newActionRow] });
          break;
      }
    } else if (
      ["TicketSetupCreate", "TicketSetupTranscript"].includes(customId)
    ) {
      switch (customId) {
        case "TicketSetupCreate":
          {
            guild.channels
              .create({
                name: "Tickets",
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                  {
                    id: setupData.CommunityRoleID,
                    deny: [PermissionFlagsBits.ViewChannel],
                  },
                  {
                    id: setupData.StaffRoleID,
                    allow: [PermissionFlagsBits.ViewChannel],
                  },
                ],
              })
              .then(async (categoryName) => {
                await setupDB.findOneAndUpdate(
                  { GuildID: guild.id },
                  { TicketParentID: categoryName.id }
                );
              });
            guild.channels
              .create({
                name: "Support Area",
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                  {
                    id: setupData.CommunityRoleID,
                    allow: [
                      PermissionFlagsBits.ViewChannel,
                      PermissionFlagsBits.ReadMessageHistory,
                    ],
                    deny: [PermissionFlagsBits.SendMessages],
                  },
                ],
              })
              .then(async (categoryName) => {
                guild.channels
                  .create({
                    name: "create-ticket",
                    type: ChannelType.GuildText,
                    parent: categoryName,
                    permissionOverwrites: [
                      {
                        id: setupData.CommunityRoleID,
                        deny: [PermissionFlagsBits.SendMessages],
                        allow: [
                          PermissionFlagsBits.ViewChannel,
                          PermissionFlagsBits.ReadMessageHistory,
                        ],
                      },
                    ],
                  })
                  .then(async (channel) => {
                    channel
                      .send({
                        embeds: [
                          new EmbedBuilder()
                            .setAuthor({
                              name: `${guild.name} | Ticket System`,
                              iconURL: guild.iconURL({ dynamic: true }),
                            })
                            .setDescription(
                              `Hey, this is an Ticket System,
                          use the Button Below to create an Ticket!`
                            )
                            .setColor("#800000")
                            .setFooter({
                              text: `Ryou - Ticket System`,
                              iconURL: user.displayAvatarURL(),
                            }),
                        ],
                        components: [
                          new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                              .setCustomId("TicketButton")
                              .setLabel("Click to make Ticket!")
                              .setStyle(ButtonStyle.Danger)
                              .setEmoji("🎫")
                          ),
                        ],
                      })
                      .then(async (message) => {
                        await setupDB.findOneAndUpdate(
                          { GuildID: guild.id },
                          { TicketMessageID: message.id }
                        );
                      });
                    await setupDB.findOneAndUpdate(
                      { GuildID: guild.id },
                      { TicketChannelID: channel.id }
                    );
                  });
              });
            await interaction.update({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Ticket Setup Complete!")
                  .setColor("#800000")
                  .setAuthor({
                    name: member.user.tag,
                    iconURL: member.user.displayAvatarURL(),
                  })
                  .setDescription(
                    "Ticket has been setup You can go ahead and Use it!"
                  )
                  .setFooter({
                    text: "Ryou - Utility",
                    iconURL: user.displayAvatarURL(),
                  }),
              ],
              components: [],
            });
            await wait(3000);
            msg.edit({
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
                    .setStyle(
                      setupData.JTCChannelID
                        ? ButtonStyle.Success
                        : ButtonStyle.Danger
                    ),
                  new ButtonBuilder()
                    .setCustomId("VerificationSetup")
                    .setLabel("Verification")
                    .setStyle(
                      setupData.VerificationChannelID
                        ? ButtonStyle.Success
                        : ButtonStyle.Danger
                    ),
                  new ButtonBuilder()
                    .setCustomId("LogsSetup")
                    .setLabel("Logs")
                    .setStyle(
                      setupData.LogChannelID
                        ? ButtonStyle.Success
                        : ButtonStyle.Danger
                    ),
                  new ButtonBuilder()
                    .setCustomId("TicketSetup")
                    .setLabel("Ticket")
                    .setStyle(
                      setupData.TicketParentID
                        ? ButtonStyle.Success
                        : ButtonStyle.Danger
                    ),
                  new ButtonBuilder()
                    .setCustomId("DefaultRolesSetup")
                    .setLabel("Default Roles")
                    .setStyle(ButtonStyle.Primary)
                ),
              ],
            });
          }
          break;
        case "TicketSetupTranscript":
          {
            if (setupData.TicketTranscript === true) {
              await setupDB.findOneAndUpdate(
                { GuildID: guild.id },
                { TicketTranscript: false }
              );
              interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("TicketSetupTranscript")
                      .setLabel("Transcript: Off")
                      .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                      .setCustomId("TicketDescription")
                      .setLabel("Change Description")
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId("SettingsMenu")
                      .setEmoji("⏩")
                      .setLabel("Back")
                      .setStyle(ButtonStyle.Primary)
                  ),
                ],
              });
            } else {
              await setupDB.findOneAndUpdate(
                { GuildID: guild.id },
                { TicketTranscript: true }
              );
              interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("TicketSetupTranscript")
                      .setLabel("Transcript: On")
                      .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                      .setCustomId("TicketDescription")
                      .setLabel("Change Description")
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId("TicketTranscriptChannel")
                      .setLabel("Transcript Channel")
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId("SettingsMenu")
                      .setEmoji("⏩")
                      .setLabel("Back")
                      .setStyle(ButtonStyle.Primary)
                  ),
                ],
              });
            }
          }
          break;
      }
    }
  },
};
