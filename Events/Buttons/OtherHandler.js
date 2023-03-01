const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ComponentType,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const captchaDB = require("../../src/models/captchaDB");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    const { customId, guild, message } = interaction;
    let captchaData = await captchaDB.findOne({ GuildID: guild.id });
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    if (
      ["unban-button", "send-invite-button", "captcha-verify"].includes(
        customId
      )
    ) {
      switch (customId) {
        case "unban-button":
          message.embeds.forEach(async (embed) => {
            const userID = embed.fields[1].value;
            guild.members
              .unban(`${userID}`)
              .then(() => {
                interaction.update({
                  components: [
                    new ActionRowBuilder().addComponents(
                      new ButtonBuilder()
                        .setCustomId("unban-button")
                        .setLabel("Unbanned")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true)
                    ),
                  ],
                });
              })
              .catch(() => {
                return interaction.reply({
                  ephemeral: true,
                  content: "This user is already unbanned",
                });
              });
          });

          break;
        case "send-invite-button":
          message.embeds.forEach(async (embed) => {
            const userID = embed.fields[0].value;
            let invite = await message.channel.createInvite({
              maxAge: 0,
              maxUses: 1,
            });
            client.users
              .send(`${userID}`, `${invite}`)
              .then(() => {
                interaction.update({
                  components: [
                    new ActionRowBuilder().addComponents(
                      new ButtonBuilder()
                        .setCustomId("send-invite-button")
                        .setLabel("Sent")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true)
                    ),
                  ],
                });
              })
              .catch(() => {
                return interaction.reply({
                  ephemeral: true,
                  content: "This user don't accept direct DM",
                });
              });
          });
          break;
        case "captcha-verify":
          const captchaModal = new ModalBuilder()
            .setCustomId(`captcha-modal`)
            .setTitle(`Captcha verification`);

          const captchaInputText = new TextInputBuilder()
            .setCustomId(`captcha-verify-input`)
            .setLabel(`Enter the code below`)
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Captcha code (eg: BekYm)")
            .setMaxLength(5)
            .setMinLength(5);
          captchaModal.addComponents(
            new ActionRowBuilder().addComponents(captchaInputText)
          );
          interaction.showModal(captchaModal);
          break;
      }
    }
  },
};
