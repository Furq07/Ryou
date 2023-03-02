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
    if (
      setupData.CommunityRoleID &&
      setupData.StaffRoleID &&
      setupData.AdminRoleID
    ) {
      const MainMsg = await interaction.reply({
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
    } else {
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
          .setCustomId("CommunityRoleFirst")
          .setLabel("Community Role")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("StaffRoleFirst")
          .setLabel("Staff Role")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("AdminRoleFirst")
          .setLabel("Admin Role")
          .setStyle(ButtonStyle.Danger)
      );
      interaction.reply({ embeds: [Embed], components: [Buttons] });
    }
  },
};
