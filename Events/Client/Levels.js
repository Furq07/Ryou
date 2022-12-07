// [-------------------[Imports]-------------------]
const { EmbedBuilder, ChannelType } = require("discord.js");
const levelDB = require("../../src/models/levelDB");
const ecoDB = require("../../src/models/ecoDB");
const setupDB = require("../../src/models/setupDB");
// [-------------------[File Initiation]-------------------]
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    // [-------------------[Leveling System]-------------------]
    let { member, channel, guild } = interaction;
    let channelToSend = channel;
    if (!guild || member.bot) return;
    const levelData = await levelDB.findOne({ MemberID: member.id });
    const setupData = await setupDB.findOne({ GuildID: guild.id });
    if (!setupData) return;
    if (channel.id == setupData.JTCSettingID) {
      guild.channels.cache.forEach((Channel) => {
        if (Channel.type == ChannelType.GuildText && channelToSend == channel)
          channelToSend = Channel;
      });
    }
    channel = channelToSend;
    if (!levelData) {
      new levelDB({
        MemberID: member.id,
        XP: 0,
        Level: 0,
      }).save();
      return;
    }
    const giveXP = Math.floor(Math.random() * 29) + 1;
    const requiredXP = levelData.Level * levelData.Level * 100 + 100;
    const randomChance = Math.floor(Math.random() * 5) + 1;
    const randomBanklimit = Math.floor(Math.random() * 124) + 23;

    if (levelData.XP + giveXP >= requiredXP) {
      await levelDB.findOneAndUpdate(
        { MemberID: member.id },
        { $inc: { XP: +giveXP, Level: +1 } }
      );

      channel.send({
        content: `${member}`,
        embeds: [
          new EmbedBuilder()
            .setColor("#800000")
            .setDescription(
              `Congrats, You Just Leveled Up to ${levelData.Level + 1}!`
            ),
        ],
      });
    } else {
      await levelDB.findOneAndUpdate(
        { MemberID: member.id },
        { $inc: { XP: +giveXP } }
      );
    }
    // [-------------------[Banklimit System]-------------------]
    if (randomChance >= 5) {
      await ecoDB.findOneAndUpdate(
        { MemberID: member.id },
        { $inc: { Banklimit: +randomBanklimit } }
      );
    }
  },
};
