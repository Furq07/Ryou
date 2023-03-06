const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  RoleSelectMenuBuilder,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { user } = client;
    const { customId, channel, message, member, guild } = interaction;
    if (
      !interaction.isButton() ||
      ![
        "CommunityRole",
        "StaffRole",
        "AdminRole",
        "CommunityRoleFirst",
        "StaffRoleFirst",
        "AdminRoleFirst",
        "JTCSetup",
        "VerificationSetup",
        "LogsSetup",
        "TicketSetup",
        "DefaultRolesSetup",
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
      // Setup Menu
    } else if (
      ["JTCSetup", "VerificationSetup", "LogsSetup", "TicketSetup"].includes(
        customId
      )
    ) {
      switch (customId) {
        case "JTCSetup":
          break;
        case "LogsSetup":
          let Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("LogChannelSetup")
              .setLabel("Log Channel")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId("SettingsMenu")
              .setEmoji("⏩")
              .setLabel("Back")
              .setStyle(ButtonStyle.Primary)
          );
          if (setupData.LogChannelID)
            Buttons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("LogChannelSetup")
                .setLabel("Log Channel")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("LogSettingsSetup")
                .setLabel("Log Settings")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("SettingsMenu")
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
                    .setCustomId("SettingsMenu")
                    .setEmoji("⏩")
                    .setLabel("Back")
                    .setStyle(ButtonStyle.Primary)
                ),
              ],
            });
          interaction.update({
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
                  .setLabel(
                    setupData.VerificationMode === false
                      ? "Mode: Normal"
                      : "Mode: Captcha"
                  )
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("VerificationDesc")
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
          break;
        case "TicketSetup":
          if (setupData.TicketParentID === undefined)
            return interaction.update({
              embeds: [
                new EmbedBuilder()
                  .setTitle("__Ticket Settings__")
                  .setDescription(
                    `
                  Do you wanna try out the Ticket System?
                  Alright Then, Simply go ahead and provide the Things below!`
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
                    .setCustomId("TicketSetupCreate")
                    .setLabel("Setup")
                    .setEmoji("✅")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId("SettingsMenu")
                    .setEmoji("⏩")
                    .setLabel("Back")
                    .setStyle(ButtonStyle.Primary)
                ),
              ],
            });
          let bttns = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("TicketSetupTranscript")
              .setLabel(
                setupData.TicketTranscript === true
                  ? "Transcript: On"
                  : "Transcript: Off"
              )
              .setStyle(
                setupData.TicketTranscript === true
                  ? ButtonStyle.Success
                  : ButtonStyle.Danger
              ),
            new ButtonBuilder()
              .setCustomId("TicketDesc")
              .setLabel("Change Description")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("SettingsMenu")
              .setEmoji("⏩")
              .setLabel("Back")
              .setStyle(ButtonStyle.Primary)
          );
          if (setupData.TicketTranscript === true)
            bttns = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("TicketSetupTranscript")
                .setLabel(
                  setupData.TicketTranscript === true
                    ? "Transcript: On"
                    : "Transcript: Off"
                )
                .setStyle(
                  setupData.TicketTranscript === true
                    ? ButtonStyle.Success
                    : ButtonStyle.Danger
                ),
              new ButtonBuilder()
                .setCustomId("TicketDesc")
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
            );

          interaction.update({
            embeds: [
              new EmbedBuilder()
                .setTitle("__Ticket Settings__")
                .setDescription(
                  `
                  There are things you can enable and disable.
                  go ahead try it out!`
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
            components: [bttns],
          });
          break;
      }
    } else if (customId === "SettingsMenu") {
      interaction.update({
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
    } else if (customId === "DefaultRolesSetup") {
      interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor("#800000")
            .setAuthor({
              name: member.user.tag,
              iconURL: member.user.displayAvatarURL(),
            })
            .setTitle("__Default Roles Menu__")
            .setDescription(
              `Click Buttons Below and Provide the Roles!
      
        **For Example:**
        If its Community Role, click on it, select it from the Select Menu and its Done!
        Do the same for all of them then click the Next button!`
            )
            .setFooter({
              text: "Ryou - Utility",
              iconURL: user.displayAvatarURL(),
            }),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("CommunityRole")
              .setLabel("Community Role")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("StaffRole")
              .setLabel("Staff Role")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("AdminRole")
              .setLabel("Admin Role")
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
  },
};
