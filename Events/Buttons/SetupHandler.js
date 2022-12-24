const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, channel, message, member, guild } = interaction;
    if (!interaction.isButton()) return;
    const setupData = await setupDB.findOne({ GuildID: guild.id });
    const msg = await channel.messages.fetch(message.id);
    const msgEmbed = msg.embeds[0];
    const author = msgEmbed.author.name;
    if (author !== member.user.tag)
      return interaction.reply({
        content: `These Buttons aren't for You!`,
        ephemeral: true,
      });
    // Startup Setup Menu
    if (["CommunityRole", "StaffRole", "AdminRole"].includes(customId)) {
      switch (customId) {
        case "CommunityRole":
          const CommunityModal = new ModalBuilder()
            .setCustomId("CommunityModal")
            .setTitle("Enter Community Role ID:");
          const CommunityRoleInput = new TextInputBuilder()
            .setCustomId("CommunityRoleInput")
            .setLabel("Enter the Id of Community Role Below:")
            .setRequired(true)
            .setMinLength(15)
            .setMaxLength(30)
            .setPlaceholder("Example: 1008473719599018134")
            .setStyle(TextInputStyle.Short);
          CommunityModal.addComponents(
            new ActionRowBuilder().addComponents(CommunityRoleInput)
          );
          await interaction.showModal(CommunityModal);
          break;
        case "StaffRole":
          const StaffModal = new ModalBuilder()
            .setCustomId("StaffModal")
            .setTitle("Enter Staff Role ID:");
          const StaffRoleInput = new TextInputBuilder()
            .setCustomId("StaffRoleInput")
            .setLabel("Enter the Id of Staff Role Below:")
            .setRequired(true)
            .setMinLength(15)
            .setMaxLength(30)
            .setPlaceholder("Example: 1008848000853999789")
            .setStyle(TextInputStyle.Short);
          StaffModal.addComponents(
            new ActionRowBuilder().addComponents(StaffRoleInput)
          );
          await interaction.showModal(StaffModal);
          break;
        case "AdminRole":
          const AdminModal = new ModalBuilder()
            .setCustomId("AdminModal")
            .setTitle("Enter Admin Role ID:");
          const AdminRoleInput = new TextInputBuilder()
            .setCustomId("AdminRoleInput")
            .setLabel("Enter the Id of Admin Role Below:")
            .setRequired(true)
            .setMinLength(15)
            .setMaxLength(30)
            .setPlaceholder("Example: 1008164208363454605")
            .setStyle(TextInputStyle.Short);
          AdminModal.addComponents(
            new ActionRowBuilder().addComponents(AdminRoleInput)
          );

          await interaction.showModal(AdminModal);
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
            return msg.edit({
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
                    .setStyle(ButtonStyle.Success)
                ),
              ],
            });
          msg.edit({
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
                  .setStyle(ButtonStyle.Primary)
              ),
            ],
          });

          break;
        case "VerificationSetup":
          break;
        case "LogsSetup":
          if (setupData.logChannelID)
            return msg.edit({
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
                    `Logs has Already been Setup on this Server,
                  If you wanna Re-Setup it, Click on the Button Below!`
                  ),
              ],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("LogResetup")
                    .setLabel("Re-Setup")
                    .setEmoji("🔁")
                    .setStyle(ButtonStyle.Success)
                ),
              ],
            });
          msg.edit({
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
                  `If you wanna Setup Logs on your Server,
                  Click on the Button Below!`
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("LogChannelCreateSetup")
                  .setLabel("Create Channel")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogChannelDeleteSetup")
                  .setLabel("Delete Channel")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogVCJoinSetup")
                  .setLabel("Join VC")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("LogVCLeaveSetup")
                  .setLabel("Leave VC")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogChannelUpdateSetup")
                  .setLabel("Channel Update")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogBanSetup")
                  .setLabel("Ban User")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("LogUnbanSetup")
                  .setLabel("Unban User")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogKickUserSetup")
                  .setLabel("Kick User")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogUpdateUserSetup")
                  .setLabel("Channel User")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("LogInviteCreateSetup")
                  .setLabel("Invite Create")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogMessageDeleteSetup")
                  .setLabel("Message Delete")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogMessageUpdateSetup")
                  .setLabel("Update Message")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("LogRoleCreateSetup")
                  .setLabel("Create Role")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogRoleDeleteSetup")
                  .setLabel("Delete Role")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogRoleUpdateSetup")
                  .setLabel("Update Role")
                  .setEmoji("❎")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("LogConfirmSetup")
                  .setLabel("Confirm")
                  .setEmoji("✅")
                  .setStyle(ButtonStyle.Primary)
              ),
            ],
          });
          break;
        case "TicketSetup":
          break;
      }
    }
  },
};
