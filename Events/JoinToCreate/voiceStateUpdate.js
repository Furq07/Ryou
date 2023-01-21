const { ChannelType, PermissionFlagsBits } = require("discord.js");
const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    let setupData = await setupDB.findOne({ GuildID: newState.guild.id });
    if (!setupData || !setupData.JTCChannelID) return;
    const join_to_create_channel = client.channels.cache.find(
      (r) => r.id === setupData.JTCChannelID
    );
    if (newState) {
      if (newState.channelId == join_to_create_channel.id) {
        const isFound = setupData.JTCInfo.some((element) => {
          if (element.owner === newState.member.id) return true;
          else return false;
        });
        if (isFound === true) return newState.member.voice.disconnect();
        newState.guild.channels
          .create({
            name: `${newState.member.displayName}\'s Vc`,
            type: ChannelType.GuildVoice,
            parent: setupData.JTCCategoryID,
            userLimit: 1,
            permissionOverwrites: [
              {
                id: newState.guild.roles.everyone.id,
                allow: [PermissionFlagsBits.ViewChannel],
                deny: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
              },
              {
                id: oldState.member.id,
                allow: [
                  PermissionFlagsBits.Connect,
                  PermissionFlagsBits.Speak,
                  PermissionFlagsBits.ViewChannel,
                ],
              },
            ],
          })
          .then((channel) => {
            newState.member.voice
              .setChannel(channel)
              .then(async (channelUser) => {
                await setupDB.findOneAndUpdate(
                  { GuildID: channel.guild.id },
                  {
                    $addToSet: {
                      JTCInfo: {
                        owner: channelUser.id,
                        channels: channel.id,
                        userLimit: 1,
                        users: [],
                      },
                    },
                  }
                );
              });
          });
      }
    }
  },
};
