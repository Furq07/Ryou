const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  RoleSelectMenuBuilder,
  ChannelSelectMenuBuilder,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const captchaDB = require("../../src/models/captchaDB");
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
        "JTCSetup",
        "VerificationSetup",
        "VerificationDescSetup",
        "VerificationChannelID",
        "LogsSetup",
        "TicketSetup",
        "LogSettingsSetup",
        "LogChannelIDSetup",
        "LogChannelIDSetupMain",
        "CommunityRoleFirst",
        "StaffRoleFirst",
        "AdminRoleFirst",
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
    // Startup Setup Menu
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
      // Main Setup Menu
    } else if (
      ["JTCSetup", "VerificationSetup", "LogsSetup", "TicketSetup"].includes(
        customId
      )
    ) {
      switch (customId) {
        case "JTCSetup":
          if (setupData.JTCChannelID)
            return interaction.update({
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
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId("MainSetupMenu")
                    .setEmoji("⏩")
                    .setLabel("Back")
                    .setStyle(ButtonStyle.Primary)
                ),
              ],
            });
          interaction.update({
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
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("MainSetupMenu")
                  .setEmoji("⏩")
                  .setLabel("Back")
                  .setStyle(ButtonStyle.Primary)
              ),
            ],
          });

          break;
        case "LogsSetup":
          let Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("LogChannelIDSetup")
              .setLabel("Log Channel")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId("MainSetupMenu")
              .setEmoji("⏩")
              .setLabel("Back")
              .setStyle(ButtonStyle.Primary)
          );
          if (setupData.LogChannelID)
            Buttons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("LogChannelIDSetupMain")
                .setLabel("Log Channel")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("LogSettingsSetup")
                .setLabel("Log Settings")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("MainSetupMenu")
                .setEmoji("⏩")
                .setLabel("Back")
                .setStyle(ButtonStyle.Primary)
            );

          interaction.update({
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
                  `Click on the Button Below and setup Log Channel to Continue!`
                ),
            ],
            components: [Buttons],
          });
          break;
        case "VerificationSetup":
          if (!guild.channels.cache.get(setupData.VerificationChannelID))
            return interaction.update({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Verification Setup Menu")
                  .setDescription(
                    `Lets Start of by Creating a Verification Channel!
                    Click on the Button Below to Create the Basics things.
                
                    After that you can change the settings as you want.`
                  )
                  .setFooter({
                    text: "Ryou - Utility",
                    iconURL: client.user.displayAvatarURL(),
                  })
                  .setColor("#800000")
                  .setAuthor({
                    name: member.user.tag,
                    iconURL: member.user.displayAvatarURL(),
                  }),
              ],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("VerificationSetupCreate")
                    .setLabel("Create")
                    .setEmoji("✅")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId("MainSetupMenu")
                    .setEmoji("⏩")
                    .setLabel("Back")
                    .setStyle(ButtonStyle.Primary)
                ),
              ],
            });
          const M = await interaction.update({
            fetchReply: true,
            embeds: [
              new EmbedBuilder()
                .setTitle("Verification Setup Menu")
                .setDescription(
                  `This is Verification Setup Menu,
                Change what you want from Below!
                
                There are 2 Modes for Verification System,
                You can change them by Clicking on the Mode Button!`
                )
                .setFooter({
                  text: "Ryou - Utility",
                  iconURL: client.user.displayAvatarURL(),
                })
                .setColor("#800000")
                .setAuthor({
                  name: member.user.tag,
                  iconURL: member.user.displayAvatarURL(),
                }),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("VerificationModeSetup")
                  .setLabel("Mode: _____")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("VerificationDescSetup")
                  .setLabel("Change Description")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("MainSetupMenu")
                  .setEmoji("⏩")
                  .setLabel("Back")
                  .setStyle(ButtonStyle.Primary)
              ),
            ],
          });
          const data = msg.components[0];
          const newActionRow = ActionRowBuilder.from(data);
          if (setupData.VerificationMode === false) {
            newActionRow.components[0]
              .setLabel("Mode: Normal")
              .setStyle(ButtonStyle.Primary);
          } else if (setupData.VerificationMode === true) {
            newActionRow.components[0]
              .setLabel("Mode: Captcha")
              .setStyle(ButtonStyle.Primary);
          }
          M.edit({ components: [newActionRow] });
          break;
        case "TicketSetup":
          break;
      }
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