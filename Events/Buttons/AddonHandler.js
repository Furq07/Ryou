const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  ChannelSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { user } = client;
    const { customId, channel, message, member, guild } = interaction;
    if (
      !interaction.isButton() ||
      ![
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
        "VerificationSetupCreate",
        "VerificationModeSetup",
        "VerificationDesc",
        "TicketSetupCreate",
        "TicketSetupTranscript",
        "TicketDesc",
        "TicketTranscriptChannel",
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
        embeds: [
          new EmbedBuilder()
            .setColor("#800000")
            .setDescription(`Sorry, But this is @${author}'s Command`),
        ],
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
                .setCustomId("LogsSetup")
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
        const componentMap = {
          LogChannelCreateSetup: { row: newActionRow, index: 0 },
          LogChannelDeleteSetup: { row: newActionRow, index: 1 },
          LogVCJoinSetup: { row: newActionRow, index: 2 },
          LogVCLeaveSetup: { row: newActionRow2, index: 0 },
          LogChannelUpdateSetup: { row: newActionRow2, index: 1 },
          LogBanSetup: { row: newActionRow2, index: 2 },
          LogUnbanSetup: { row: newActionRow3, index: 0 },
          LogKickUserSetup: { row: newActionRow3, index: 1 },
          LogUpdateUserSetup: { row: newActionRow3, index: 2 },
          LogInviteCreateSetup: { row: newActionRow4, index: 0 },
          LogMessageDeleteSetup: { row: newActionRow4, index: 1 },
          LogMessageUpdateSetup: { row: newActionRow4, index: 2 },
          LogRoleCreateSetup: { row: newActionRow5, index: 0 },
          LogRoleDeleteSetup: { row: newActionRow5, index: 1 },
          LogRoleUpdateSetup: { row: newActionRow5, index: 2 },
        };

        let row = componentMap[customId].row;
        let index = componentMap[customId].index;

        if (!setupData[customId] || setupData[customId] === false) {
          row.components[index].setStyle(ButtonStyle.Success);
          await setupDB.findOneAndUpdate(
            { GuildID: guild.id },
            { [customId]: true }
          );
        } else {
          row.components[index].setStyle(ButtonStyle.Danger);
          await setupDB.findOneAndUpdate(
            { GuildID: guild.id },
            { [customId]: false }
          );
        }

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
      [
        "VerificationSetupCreate",
        "VerificationModeSetup",
        "VerificationDesc",
      ].includes(customId)
    ) {
      switch (customId) {
        case "VerificationSetupCreate":
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
        case "VerificationDesc":
          const VerificationDescModal = new ModalBuilder()
            .setCustomId(`VerificationDescModal`)
            .setTitle(`Write Custom Descripton Here`);
          const VerificationDescInput = new TextInputBuilder()
            .setCustomId(`VerificationDescInput`)
            .setLabel(`Write Amazing Description Below:`)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder(
              `In order to get access in ${guild.name}, verify yourself using Verify Button!`
            );
          VerificationDescModal.addComponents(
            new ActionRowBuilder().addComponents(VerificationDescInput)
          );
          await interaction.showModal(VerificationDescModal);
          break;
      }
    } else if (
      [
        "TicketSetupCreate",
        "TicketSetupTranscript",
        "TicketDesc",
        "TicketTranscriptChannel",
      ].includes(customId)
    ) {
      switch (customId) {
        case "TicketSetupCreate":
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
          let setupData = await setupDB.findOne({ GuildID: guild.id });
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

          break;
        case "TicketSetupTranscript":
          if (setupData.TicketTranscript === true) {
            await setupDB.findOneAndUpdate(
              { GuildID: guild.id },
              { TicketTranscript: false, $unset: { TicketTranscriptID: "" } }
            );
            interaction.update({
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("TicketSetupTranscript")
                    .setLabel("Transcript: Off")
                    .setStyle(ButtonStyle.Danger),
                  new ButtonBuilder()
                    .setCustomId("TicketDesc")
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
            interaction.update({
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("TicketSetupTranscript")
                    .setLabel("Transcript: On")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId("TicketDesc")
                    .setLabel("Change Description")
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId("SettingsMenu")
                    .setEmoji("⏩")
                    .setLabel("Back")
                    .setStyle(ButtonStyle.Primary)
                ),
                new ActionRowBuilder().addComponents(
                  new ChannelSelectMenuBuilder()
                    .setCustomId("TicketTranscriptMenu")
                    .setPlaceholder("Choose the Transcript Channel!")
                ),
              ],
            });
          }
          break;
        case "TicketDesc":
          const TicketDescModal = new ModalBuilder()
            .setCustomId(`TicketDescModal`)
            .setTitle(`Write Custom Descripton Here`);
          const TicketDescInput = new TextInputBuilder()
            .setCustomId(`TicketDescInput`)
            .setLabel(`Write Amazing Description Below:`)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder(
              `Hey, this is an Ticket System,\nuse the Button Below to create an Ticket!`
            );
          TicketDescModal.addComponents(
            new ActionRowBuilder().addComponents(TicketDescInput)
          );
          await interaction.showModal(TicketDescModal);
          break;
        case "TicketTranscriptChannel":
          newActionRow.components[0].setDisabled(true);
          newActionRow.components[1].setDisabled(true);
          newActionRow.components[2].setDisabled(true);
          interaction.update({
            components: [
              newActionRow,
              new ActionRowBuilder().addComponents(
                new ChannelSelectMenuBuilder()
                  .setCustomId("TicketTranscriptMenu")
                  .setPlaceholder("Choose the Transcript Channel!")
              ),
            ],
          });
          break;
      }
    }
  },
};
