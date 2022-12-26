const { EmbedBuilder } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
// This event send message(s) in the log channel(s) about who joined a voice channel after filtering jtc (if setuped)
module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    // Checking after fetching all data
    let setupData = await setupDB.findOne({ GuildID: newState.guild.id });
    if (!setupData || !setupData.LogChannelID) return;
    if (setupData.LogVCJoinSetup === false) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);

    // Main piece of code
    if (newState && !oldState.streaming) {
      if (newState.channelId !== setupData.JTCChannelID) {
        try {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setDescription(`A user has joined a voice channel`)
                .addFields(
                  {
                    name: "User:",
                    value: `<@${newState.member.user.id}> (${newState.member.user.id})`,
                  },
                  { name: "Channel:", value: `<#${newState.channel.id}>` }
                )
                .setFooter({
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  text: "Ryou - Logs",
                })
                .setAuthor({
                  name: "Channel Join",
                  iconURL: `${oldState.guild.iconURL({ dynamic: true })}`,
                })
                .setTimestamp(),
            ],
          });
        } catch (err) {
          return;
        }
      }
    }
  },
};
