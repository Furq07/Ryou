const { EmbedBuilder } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
// This event send message(s) in the log channel(s) about who left a voice channel after filtering jtc (if setuped
module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    // Checking after fetching all data
    let setupData = await setupDB.findOne({ GuildID: oldState.guild.id });
    if (!setupData || !setupData.LogChannelID) return;
    if (setupData.LogVCLeaveSetup === false) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);

    // Main piece of code
    if (oldState) {
      if (oldState.channelId !== setupData.JTCChannelID) {
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setDescription(`A user has left a voice channel`)
              .addFields(
                {
                  name: "User:",
                  value: `<@${oldState.member.user.id}> (${oldState.member.user.id})`,
                },
                { name: "Channel:", value: `<#${oldState.channel.id}>` }
              )
              .setFooter({
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                text: "Ryou - Logs",
              })
              .setAuthor({
                name: "Channel Leave",
                iconURL: `${oldState.guild.iconURL({ dynamic: true })}`,
              })
              .setTimestamp(),
          ],
        });
      }
    }
  },
};
