const {
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "setup",
  description: "Setup the Bot Completely on your Server!",
  userPermissions: [PermissionsBitField.Flags.Administrator],
  async execute(interaction, client) {
    const { member, guild } = interaction;
    const { user } = client;
    const setupData = await setupDB.findOne({ GuildID: guild.id });
    const Embed = new EmbedBuilder()
      .setColor("#800000")
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL(),
      })
      .setTitle("__Startup Setup Menu__")
      .setDescription(
        `Click Buttons Below and Provide the Id of the Roles.
        
        **For example:**
        If its Bot Role, go ahead and copy the id of the Role that you Assign to your Bots,

        **If you don't know how to do that read this Below:**
        Enable developer mode in the Appearance section of your user settings,
        then go to the role menu in the server settings and right click on the role you want the ID of,
        then click "Copy ID".
        
        On Android press and hold the Server name above the channel list.
        You should see the last item on the drop-down menu: 'Copy ID'.
        Click Copy ID to get the ID.`
      )
      .setFooter({
        text: "Ryou - Utility",
        iconURL: user.displayAvatarURL(),
      });
    let Buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("CommunityRole")
        .setLabel("Community Role")

        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("StaffRole")
        .setLabel("Staff Role")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("AdminRole")
        .setLabel("Admin Role")
        .setStyle(ButtonStyle.Danger)
    );
    if (
      setupData.CommunityRoleID &&
      setupData.StaffRoleID &&
      setupData.AdminRoleID
    )
      Buttons = new ActionRowBuilder().addComponents(
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
          .setCustomId("SkipSetup")
          .setLabel("Skip to Main Setup Menu")
          .setEmoji("⏩")
          .setStyle(ButtonStyle.Primary)
      );

    interaction.reply({ embeds: [Embed], components: [Buttons] });
  },
};
