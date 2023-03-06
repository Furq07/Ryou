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
    if (customId === "CommunityRoleMenuFirst") customIdE = "CommunityRoleMenu";
    if (customId === "StaffRoleMenuFirst") customIdE = "StaffRoleMenu";
    if (customId === "AdminRoleMenuFirst") customIdE = "AdminRoleMenu";
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
                  .setCustomId("SettingsMenu")
                  .setEmoji("⏩")
                  .setLabel("Next")
                  .setStyle(ButtonStyle.Primary)
              ),
            ],
          });
        }
      }
    } else if ("LogChannelMenu" === customIdE) {
      await setupDB.findOneAndUpdate(
        { GuildID: guild.id },
        { LogChannelID: Value }
      );
      interaction.update({
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("LogChannelSetup")
              .setLabel("Log Channel")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("LogSettingsSetup")
              .setLabel("Log Settings")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("SettingsMenu")
              .setEmoji("⏩")
              .setLabel("Back")
              .setStyle(ButtonStyle.Primary)
          ),
        ],
      });
    } else if ("TicketTranscriptMenu" === customIdE) {
      await setupDB.findOneAndUpdate(
        { GuildID: guild.id },
        { TicketTranscriptID: Value }
      );
      newActionRow.components[0].setDisabled(false);
      newActionRow.components[1].setDisabled(false);
      newActionRow.components[2]
        .setStyle(ButtonStyle.Success)
        .setDisabled(false);
      interaction.update({
        components: [newActionRow],
      });
    }
  },
};
