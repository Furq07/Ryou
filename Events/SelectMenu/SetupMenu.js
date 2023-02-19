const { ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isAnySelectMenu()) return;
    const { customId, guild, values, message, channel } = interaction;
    const msg = await channel.messages.fetch(message.id);
    const data = msg.components[0];
    const newActionRow = ActionRowBuilder.from(data);
    let customIdE = customId;
    if (customId === "CommunityRoleMenuFirst") customIdE = "CommunityRoleMenu";
    if (customId === "StaffRoleMenuFirst") customIdE = "StaffRoleMenu";
    if (customId === "AdminRoleMenuFirst") customIdE = "AdminRoleMenu";
    if (
      ["CommunityRoleMenu", "StaffRoleMenu", "AdminRoleMenu"].includes(
        customIdE
      )
    ) {
      const Role = values.join(", ");
      switch (customIdE) {
        case "CommunityRoleMenu":
          await setupDB.findOneAndUpdate(
            { GuildID: guild.id },
            { CommunityRoleID: Role }
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
            { StaffRoleID: Role }
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
            { AdminRoleID: Role }
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
    }
  },
};
