const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { user } = client;
    const { customId, channel, message, member, guild } = interaction;
    if (!interaction.isButton()) return;
    if (
      ![
        "JTCSetup",
        "VerificationSetup",
        "LogsSetup",
        "TicketSetup",
        "MainSetupMenu",
        "DefaultRolesSetup",
      ].includes(customId)
    )
      return;
    const setupData = await setupDB.findOne({ GuildID: guild.id });
    const msg = await channel.messages.fetch(message.id);
    const data = msg.components[0];
    const msgEmbed = msg.embeds[0];
    const author = msgEmbed.author.name;
    if (author !== member.user.tag)
      return interaction.reply({
        content: `These Buttons aren't for You!`,
        ephemeral: true,
      });

    // Setup Menu
    if (
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
    } else if (customId === "MainSetupMenu") {
      const MainMsg = await interaction.update({
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
    } else if (customId === "DefaultRolesSetup") {
      const Embed = new EmbedBuilder()
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
        });
      const Buttons = new ActionRowBuilder().addComponents(
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
          .setCustomId("MainSetupMenu")
          .setEmoji("⏩")
          .setLabel("Back")
          .setStyle(ButtonStyle.Primary)
      );
      interaction.update({ embeds: [Embed], components: [Buttons] });
    }
  },
};
