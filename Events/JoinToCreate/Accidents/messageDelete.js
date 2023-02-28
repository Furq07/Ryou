const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const setupDB = require("../../../src/models/setupDB");
module.exports = {
  name: "messageDelete",
  async execute(message, client) {
    let setupData = await setupDB.findOne({ GuildID: message.guild.id });
    if (setupData.JTCAutoRecover === false) return;
    if (message.id === setupData.JTCSettingMessageID) {
      message.guild.channels.cache
        .get(setupData.JTCSettingID)
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setTitle("Join to Create Settings")
              .setDescription(
                "You can manage your Custom VCs Using the Buttons Below!"
              ),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("jtc-delete-vc-button")
                .setLabel("Delete VC")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("jtc-rename-vc-button")
                .setLabel("Rename VC")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("jtc-user-limit-button")
                .setLabel("User Limit")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("jtc-lock-channel-button")
                .setLabel("Lock VC")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("jtc-unlock-channel-button")
                .setLabel("Unlock VC")
                .setStyle(ButtonStyle.Primary)
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("jtc-add-user-button")
                .setLabel("Add User")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("jtc-remove-user-button")
                .setLabel("Remove User")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("jtc-hide-button")
                .setLabel("Hide VC")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("jtc-unhide-button")
                .setLabel("Unhide VC")
                .setStyle(ButtonStyle.Primary)
            ),
          ],
        })
        .then(async (message) => {
          await setupDB.findOneAndUpdate(
            { GuildID: message.guild.id },
            { JTCSettingMessageID: message.id }
          );
        });
    }
  },
};
