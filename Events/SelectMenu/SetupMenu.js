const {
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  EmbedBuilder,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isAnySelectMenu()) return;
    const { customId, guild, values, message, channel, member } = interaction;
    let customIdE = customId;
    const msg = await channel.messages.fetch(message.id);
    const data = msg.components[0];
    const newActionRow = ActionRowBuilder.from(data);
    const Value = values.join(", ");
    const setupData = await setupDB.findOne({ GuildID: guild.id });
    if (customId === "CommunityRoleMenuFirst") customIdE = "CommunityRoleMenu";
    if (customId === "StaffRoleMenuFirst") customIdE = "StaffRoleMenu";
    if (customId === "AdminRoleMenuFirst") customIdE = "AdminRoleMenu";
    if (customId === "LogChannelMenuMain") customIdE = "LogChannelMenu";
    if (
      ["CommunityRoleMenu", "StaffRoleMenu", "AdminRoleMenu"].includes(
        customIdE
      )
    ) {
      switch (customIdE) {
        case "CommunityRoleMenu":
          await setupDB.findOneAndUpdate(
            { GuildID: guild.id },
            { CommunityRoleID: Value }
          );
          newActionRow.components[0]
            .setDisabled(false)
            .setStyle(ButtonStyle.Success);
          newActionRow.components[1].setDisabled(false);
          newActionRow.components[2].setDisabled(false);
          interaction.update({ components: [newActionRow] });
          break;
        case "StaffRoleMenu":
          await setupDB.findOneAndUpdate(
            { GuildID: guild.id },
            { StaffRoleID: Value }
          );
          newActionRow.components[0].setDisabled(false);
          newActionRow.components[1]
            .setDisabled(false)
            .setStyle(ButtonStyle.Success);
          newActionRow.components[2].setDisabled(false);
          interaction.update({ components: [newActionRow] });
          break;
        case "AdminRoleMenu":
          await setupDB.findOneAndUpdate(
            { GuildID: guild.id },
            { AdminRoleID: Value }
          );
          newActionRow.components[0].setDisabled(false);
          newActionRow.components[1].setDisabled(false);
          newActionRow.components[2]
            .setDisabled(false)
            .setStyle(ButtonStyle.Success);
          interaction.update({ components: [newActionRow] });
          break;
      }
      const setupData = await setupDB.findOne({ GuildID: guild.id });
      if (
        [
          "CommunityRoleMenuFirst",
          "StaffRoleMenuFirst",
          "AdminRoleMenuFirst",
        ].includes(customId)
      ) {
        if (
          setupData.CommunityRoleID &&
          setupData.StaffRoleID &&
          setupData.AdminRoleID
        ) {
          msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("CommunityRole")
                  .setLabel("Community Role")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("StaffRole")
                  .setLabel("Staff Role")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("AdminRole")
                  .setLabel("Admin Role")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("MainSetupMenu")
                  .setEmoji("⏩")
                  .setLabel("Next")
                  .setStyle(ButtonStyle.Primary)
              ),
            ],
          });
        }
      }
    } else if (["LogChannelMenu"].includes(customIdE)) {
      await setupDB.findOneAndUpdate(
        { GuildID: guild.id },
        { LogChannelID: Value }
      );
      if (customId === "LogChannelMenuMain") {
        newActionRow.components[0]
          .setDisabled(false)
          .setStyle(ButtonStyle.Success);
        interaction.update({ components: [newActionRow] });
      } else {
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
      }
    }
  },
};
