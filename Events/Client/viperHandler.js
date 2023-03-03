const cron = require("node-cron");
const setupDB = require("../../src/models/setupDB");
const moment = require("moment/moment");

module.exports = {
  name: "ready",
  execute: async (client) => {
    cron.schedule("0 */6 * * *", async function () {
    const guilds = client.guilds.cache.map((guild) => guild.id);
    for (const id of guilds) {
      try {
        const setupData = await setupDB.findOne({ GuildID: id });

        if (!setupData) return;

        const jtcchannels = setupData.JTCInfo.map((element) => {
          return element.channel;
        });

        if (jtcchannels && jtcchannels.length !== 0) {
          const joinTime = moment(jtcchannels.lastJoinedTime);
          const currentTime = moment();
          const diffInMinutes = currentTime.diff(joinTime, "minutes");
          if (diffInMinutes <= 10) {
            const size = Object.keys(setupData.JTCInfo).length;
            for (let i = 0; i < size; i++) {
              const channel = await client.channels.fetch(jtcchannels[i]);
              if (channel && channel.members.size === 0) {
                await channel.delete();
                await setupDB.updateOne(
                  {
                    GuildID: id,
                  },
                  { $pull: { JTCInfo: { owner: jtcchannels.owner } } }
                );
              }
            }
          }
        }
      } catch (error) {
        console.log("Error:", error);
        continue;
      }
    }
    });
  },
};
