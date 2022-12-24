const { EmbedBuilder, time } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "inviteCreate",
  async execute(invite, client) {
    let setupData = await setupDB.findOne({ GuildID: invite.guild.id });
    if (!setupData) return;
    if (!setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
    logChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#800000")
          .setDescription(`A server invitation was created`)
          .addFields(
            {
              name: "Creator:",
              value: `<@${invite.inviter.id}>`,
              inline: true,
            },
            {
              name: "Uses:",
              value: `${invite.maxUses > 0 ? invite.maxUses : "No limit"}`,
              inline: true,
            },
            {
              name: "Expiry:",
              value: `${time(invite.expiresAt)}`,
            },
            {
              name: "Invite:",
              value: `${invite}`,
            }
          )
          .setFooter({
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
            text: "Ryou - Logs",
          })
          .setAuthor({
            name: "Invite Create",
            iconURL: `${invite.guild.iconURL({ dynamic: true })}`,
          })
          .setTimestamp(),
      ],
    });
  },
};
