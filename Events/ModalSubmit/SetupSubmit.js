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
    if (
      type !== InteractionType.ModalSubmit ||
      !["LogChannelModal", "VerificationDescModal"].includes(customId)
    )
      return;
    const msg = await channel.messages.fetch(message.id);
    const data = msg.components[0];
    const newActionRow = ActionRowBuilder.from(data);
    const setupData = await setupDB.findOne({ GuildID: guild.id });
    if (customId === "LogChannelModal") {
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
      guild.channels
        .fetch(`${setupData.VerificationChannelID}`)
        .then((channel) => {
          channel.messages
            .fetch(`${setupData.VerificationMessageID}`)
            .then((message) => {
              const Embed = message.embeds[0];
              const editEmbed = EmbedBuilder.from(Embed).setDescription(
                `${VerificationDesc}`
              );
              message.edit({ embeds: [editEmbed] });
            });
        });
      newActionRow.components[1].setStyle(ButtonStyle.Success);
      interaction.update({
        components: [newActionRow],
      });
    }
  },
};
