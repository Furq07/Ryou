const {
  InteractionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const draftDB = require("../../src/models/draftDB");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { guild, type, customId, message, channel, fields, member } =
      interaction;
    if (type !== InteractionType.ModalSubmit) return;
    const draftData = await draftDB.findOne({ GuildID: guild.id });
    const msg = await channel.messages.fetch(message.id);
    const msgEmbed = msg.embeds[0];
    const MsgEmbed = EmbedBuilder.from(msgEmbed);
    const data = msg.components[0];
    const newActionRow = ActionRowBuilder.from(data);
    const data2 = msg.components[1];
    const newActionRow2 = ActionRowBuilder.from(data2);
    if (["CommunityModal", "StaffModal", "AdminModal"].includes(customId)) {
      switch (customId) {
        case "CommunityModal":
          const CommunityRole = fields.getTextInputValue("CommunityRoleInput");
          if (!guild.roles.cache.has(CommunityRole))
            return interaction.reply({
              content: "The ID was Incorrect, Please Enter an Correct ID!",
              ephemeral: true,
            });
          await setupDB.findOneAndUpdate(
            { GuildID: guild.id },
            { CommunityRoleID: CommunityRole }
          );
          newActionRow.components[0]
            .setDisabled(true)
            .setStyle(ButtonStyle.Success);

          interaction.update({ components: [newActionRow] });
          break;
        case "StaffModal":
          const StaffRole = fields.getTextInputValue("StaffRoleInput");
          if (!guild.roles.cache.has(StaffRole))
            return interaction.reply({
              content: "The ID was Incorrect, Please Enter an Correct ID!",
              ephemeral: true,
            });
          await setupDB.findOneAndUpdate(
            { GuildID: guild.id },
            { StaffRoleID: StaffRole }
          );
          newActionRow.components[1]
            .setDisabled(true)
            .setStyle(ButtonStyle.Success);

          interaction.update({ components: [newActionRow] });
          break;
        case "AdminModal":
          const AdminRole = fields.getTextInputValue("AdminRoleInput");
          if (!guild.roles.cache.has(AdminRole))
            return interaction.reply({
              content: "The ID was Incorrect, Please Enter an Correct ID!",
              ephemeral: true,
            });
          await setupDB.findOneAndUpdate(
            { GuildID: guild.id },
            { AdminRoleID: AdminRole }
          );
          newActionRow.components[2]
            .setDisabled(true)
            .setStyle(ButtonStyle.Success);

          interaction.update({ components: [newActionRow] });
          break;
      }

      const setupData = await setupDB.findOne({ GuildID: guild.id });
      if (
        setupData.CommunityRoleID &&
        setupData.StaffRoleID &&
        setupData.AdminRoleID
      ) {
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
    } else if (customId === "LogChannelModal") {
      const setupData = await setupDB.findOne({ GuildID: guild.id });
      const LogChannel = fields.getTextInputValue("LogChannelInput");
      if (!guild.channels.cache.has(LogChannel))
        return interaction.reply({
          content: "The ID was Incorrect, Please Enter an Correct ID!",
          ephemeral: true,
        });
      await setupDB.findOneAndUpdate(
        { GuildID: guild.id },
        { LogChannelID: LogChannel }
      );
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
              .setLabel("Main Setup Menu")
              .setEmoji("⏪")
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
    } else if ("VerificationDescModal" === customId) {
      const VerificationDesc = fields.getTextInputValue(
        "VerificationDescInput"
      );
      newActionRow.components[1].setStyle(ButtonStyle.Success);
      await draftDB.findOneAndUpdate(
        { GuildID: guild.id },
        { VerificationDesc: `${VerificationDesc}` }
      );
      interaction.update({
        embeds: [
          MsgEmbed.setDescription(
            `This is Main Verification Setup Menu,
            Choose what you want to do from Below!

            There are 2 Modes for Verification System,
            You can change them by Clicking on Mode Button!
            
            **Description Preview:**
            ${VerificationDesc}`
          ),
        ],
        components: [newActionRow, newActionRow2],
      });
    } else if ("VerificationChannelModal" === customId) {
      const VerificationChannel = fields.getTextInputValue(
        "VerificationChannelInput"
      );
      if (!guild.channels.cache.find((c) => c.id === VerificationChannel))
        return interaction.reply({
          content: "The Provided ID for Channel is Invalid.",
          ephemeral: true,
        });
      newActionRow.components[2].setStyle(ButtonStyle.Success);
      await draftDB.findOneAndUpdate(
        { GuildID: guild.id },
        { VerificationChannelID: VerificationChannel }
      );
      interaction.update({
        components: [newActionRow, newActionRow2],
      });
    }
  },
};
