const { ChannelType, PermissionFlagsBits } = require("discord.js");
const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    let setupData = await setupDB.findOne({ GuildID: newState.guild.id });
    if (!setupData) return;
    if (!setupData.JTCChannelID) return;
    const join_to_create_channel = client.channels.cache.find(
      (r) => r.id === setupData.JTCChannelID
    );
    const parent = client.channels.cache.find(
      (r) => r.id === setupData.JTCCategoryID
    );
    const everyone = newState.guild.roles.cache.find(
      (x) => x.name === "@everyone"
    );
    if (newState) {
      if (newState.channelId == join_to_create_channel.id) {
        const isFound = setupData.JTCInfo.some((element) => {
          if (element.owner === newState.member.id) {
            return true;
          } else {
            return false;
          }
        });
        if (isFound === true) {
          newState.member.voice.disconnect();
        } else {
          newState.guild.channels
            .create({
              name: `${newState.member.displayName}\'s Vc`,
              type: ChannelType.GuildVoice,
              parent: parent,
              userLimit: 1,
              permissionOverwrites: [
                {
                  id: everyone.id,
                  allow: [PermissionFlagsBits.ViewChannel],
                  deny: [
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Speak,
                  ],
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
    }
  },
};
