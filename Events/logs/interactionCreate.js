const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    const { customId, member } = interaction;
    if (["unban-button", "send-invite-button"].includes(customId)) {
      switch (customId) {
        case "unban-button":
          interaction.message.embeds.forEach(async (embed) => {
            const userID = embed.fields[1].value;
            interaction.guild.members
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
              .catch((err) => {
                return interaction.reply({
                  ephemeral: true,
                  content: "This user is already unbanned",
                });
              });
          });

          break;
        case "send-invite-button":
          interaction.message.embeds.forEach(async (embed) => {
            const userID = embed.fields[0].value;
            let invite = await interaction.message.channel.createInvite({
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
      }
    }
  },
};
