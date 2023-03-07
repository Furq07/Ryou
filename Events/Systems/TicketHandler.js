const {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
const ticketDB = require("../../src/models/ticketDB");
const { createTranscript } = require("discord-html-transcripts");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    const { guild, customId, member, channel } = interaction;
    const setupData = await setupDB.findOne({ GuildID: guild.id });
    const ticketData = await ticketDB.findOne({ MemberID: member.id });
    if (customId == "TicketButton") {
      if (ticketData)
        return interaction.reply({
          content: "You Already have an Ticket Opened!",
          ephemeral: true,
        });
      const modal = new ModalBuilder()
        .setCustomId("TicketModal")
        .setTitle("Describe your Problem!");

      const Info = new TextInputBuilder()
        .setCustomId("TicketInfo")
        .setLabel("How can we Help you?")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph);
      const InfoActionRow = new ActionRowBuilder().addComponents(Info);
      modal.addComponents(InfoActionRow);
      await interaction.showModal(modal);
      const filter = (i) => i.customId === "TicketModal";
      interaction.awaitModalSubmit({ filter, time: 300000 }).then(async (i) => {
        const TicketInfo = i.fields.getTextInputValue("TicketInfo");
        const ID = Math.floor(Math.random() * 9000) + 1000;
        await guild.channels
          .create({
            name: `ticket-${ID}`,
            type: ChannelType.GuildText,
            parent: setupData.TicketParentID,
            permissionOverwrites: [
              {
                id: member.id,
                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.ReadMessageHistory,
                ],
                deny: [PermissionFlagsBits.SendMessages],
              },
              {
                id: setupData.CommunityRoleID,
                deny: [
                  PermissionFlagsBits.ReadMessageHistory,
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ViewChannel,
                ],
              },
              {
                id: setupData.StaffRoleID,
                allow: [
                  PermissionFlagsBits.ReadMessageHistory,
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ViewChannel,
                ],
              },
            ],
          })
          .then(async (c) => {
            new ticketDB({
              GuildID: guild.id,
              MemberID: member.id,
              ChannelID: c.id,
              TicketID: ID,
              LockStatus: false,
            }).save();

            const embed = new EmbedBuilder()
              .setAuthor({
                name: `${guild.name} | Ticket: ${ID}`,
                iconURL: guild.iconURL({ dynamic: true }),
              })
              .setDescription(
                `**Please Wait Patiently for a Response from the Staff Team.**
                
                __**User's Issue:**__
                ${TicketInfo}`
              )
              .setFooter({ text: "The Buttons Below are Staff Only Buttons" });

            const Buttons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("TicketClose")
                .setLabel("Save & Close Ticket")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("💾"),
              new ButtonBuilder()
                .setCustomId("TicketLock")
                .setLabel("Lock Ticket")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🔒"),
              new ButtonBuilder()
                .setCustomId("TicketUnlock")
                .setLabel("Unlock Ticket")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("🔓"),
              new ButtonBuilder()
                .setCustomId("TicketClaim")
                .setLabel("Claim Ticket")
                .setStyle(ButtonStyle.Success)
                .setEmoji("🛄")
            );
            c.send({
              embeds: [embed],
              components: [Buttons],
            });
            i.reply({
              content: `${member} Your ticket has been created: ${c}`,
              ephemeral: true,
            });
          });
      });
    } else if (
      ["TicketClose", "TicketLock", "TicketUnlock", "TicketClaim"].includes(
        customId
      )
    ) {
      if (!member.roles.cache.find((r) => r.id === setupData.StaffRoleID))
        return interaction.reply({
          content: "These Buttons are Staff Only, Please Resist from using it!",
          ephemeral: true,
        });
      const ticketData = await ticketDB.findOne({ ChannelID: channel.id });
      if (!ticketData)
        return interaction.reply({
          content:
            "There was no Data Found for this Ticket, Please Delete this Ticket Manually!",
        });
      const embed = new EmbedBuilder()
        .setColor("#80000")
        .setTitle("Ticket System");
      switch (customId) {
        case "TicketClaim":
          if (ticketData.ClaimedID)
            return interaction.reply({
              content: `The Ticket is already Claimed By <@${ticketData.ClaimedID}>`,
              ephemeral: true,
            });
          await ticketDB.findOneAndUpdate(
            { ChannelID: channel.id },
            { ClaimedID: member.id }
          );
          channel.permissionOverwrites.edit(member, {
            SendMessages: true,
          });
          guild.members.fetch(`${ticketData.MemberID}`).then((user) => {
            channel.permissionOverwrites.edit(user, {
              SendMessages: true,
            });
          });
          interaction.reply({
            embeds: [
              embed.setDescription(
                `🛄 | <@${member.id}> Has Claimed this Ticket!`
              ),
            ],
          });
          break;
        case "TicketLock":
          if (ticketData.LockStatus === true)
            return interaction.reply({
              content:
                "This Ticket is already Locked, If you wanna Unlock it Click on the Unlock Ticket Button!",
              ephemeral: true,
            });
          await ticketDB.findOneAndUpdate(
            { ChannelID: channel.id },
            { LockStatus: true }
          );
          guild.members.fetch(`${ticketData.MemberID}`).then((user) => {
            channel.permissionOverwrites.edit(user, {
              SendMessages: false,
            });
          });
          interaction.reply({
            embeds: [embed.setDescription("🔒 | This Ticket has Been Locked!")],
          });
          break;
        case "TicketUnlock":
          if (ticketData.LockStatus === false)
            return interaction.reply({
              content:
                "This Ticket is already Unlocked, If you wanna Lock it Click on the Lock Ticket Button!",
              ephemeral: true,
            });
          await ticketDB.findOneAndUpdate(
            { ChannelID: channel.id },
            { LockStatus: false }
          );
          guild.members.fetch(`${ticketData.MemberID}`).then((user) => {
            channel.permissionOverwrites.edit(user, {
              SendMessages: true,
            });
          });
          interaction.reply({
            embeds: [embed.setDescription("🔓 | This Ticket is now Unlocked.")],
          });
          break;
        case "TicketClose":
          if (setupData.TicketTranscript === true) {
            const attachment = await createTranscript(channel, {
              limit: -1,
              returnBuffer: false,
              fileName: `Ticket - ${ticketData.TicketID}.html`,
            });
            guild.members.fetch(ticketData.MemberID).then(async (user) => {
              const msg = await guild.channels.cache
                .get(setupData.TicketTranscriptID)
                .send({
                  embeds: [
                    new EmbedBuilder()
                      .setAuthor({
                        name: `${user.user.tag}`,
                        iconURL: user.displayAvatarURL(),
                      })
                      .setColor("#800000")
                      .setDescription(
                        `**Ticket User:** ${user}
                      **Ticket ID:** ${ticketData.TicketID}`
                      )
                      .setFooter({
                        text: "Ryou - Ticket System",
                        iconURL: client.user.displayAvatarURL(),
                      }),
                  ],
                  files: [attachment],
                });
              interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor("#800000")
                    .setDescription(
                      `The Transcript is now saved [Click Here](${msg.url})!`
                    ),
                ],
              });
            });
          } else {
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("#800000")
                  .setDescription(`This is Ticket is being Closed!`),
              ],
            });
          }

          await wait(5000);
          channel.delete();
          await ticketDB.findOneAndDelete({ ChannelID: channel.id });
          break;
      }
    }
  },
};
