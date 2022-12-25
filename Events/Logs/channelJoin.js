const { EmbedBuilder, AutoModerationRuleEventType } = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    let setupData = await setupDB.findOne({ GuildID: newState.guild.id });
    if (!setupData) return;
    if (!setupData.LogChannelID) return;
    const logChannel = client.channels.cache.get(`${setupData.LogChannelID}`);
    if (setupData.LogVCJoinSetup === false) return;

    if (newState) {
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
