const {
  InteractionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { guild, type, customId, message, channel, fields, member } =
      interaction;
    if (type !== InteractionType.ModalSubmit) return;
    if (!["CommunityModal", "StaffModal", "AdminModal"].includes(customId))
      return;

    const msg = await channel.messages.fetch(message.id);
    const data = msg.components[0];
    const newActionRow = ActionRowBuilder.from(data);

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
      const embed = new EmbedBuilder()
        .setTitle("__Opening Main Setup Menu__")
        .setDescription(
          `This Embed will be changed to **Main Setup Menu** in \`3 Seconds\`!`
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({
          text: "Ryou - Utility",
          iconURL: client.user.displayAvatarURL(),
        });
      msg.edit({
        embeds: [embed],
        components: [],
      });
      for (let i = 3; i > 0; i--) {
        await wait(1000);
        msg.edit({
          embeds: [
            embed.setDescription(
              `This Embed will be changed to **Main Setup Menu** in \`${i} Seconds\`!`
            ),
          ],
        });
      }
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
      const data = MainMsg.components[0];
      const newActionRow = ActionRowBuilder.from(data);
      if (setupData.JTCChannelID) {
        newActionRow.components[0].setStyle(ButtonStyle.Success);
      } else if (setupData.VerificationChannelID) {
        newActionRow.components[1].setStyle(ButtonStyle.Success);
      } else if (setupData.LogChannelID) {
        newActionRow.components[2].setStyle(ButtonStyle.Success);
      } else if (setupData.TicketParentID) {
        newActionRow.components[3].setStyle(ButtonStyle.Success);
      }
      MainMsg.edit({
        components: [newActionRow],
      });
    }
  },
};
