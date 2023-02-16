const cron = require("node-cron");
const setupDB = require("../../src/models/setupDB");
const moment = require("moment/moment");
module.exports = {
  name: "ready",
  async execute(client) {
    client.channels.fetch("1056559754513760276").then(async (channel) => {
      channel.send({ content: "testing" });
      client.guilds.cache.forEach(async (guild) => {
        try {
          var size = Object.keys(setupData.JTCInfo).length;
          console.log(size);
          // for (let i = 0; i < size; i++) {
          //   let setupData = await setupDB.findOne({ GuildID: guild.id });
          //   console.log(guild.id);
          //   const jtcchannels = setupData.JTCInfo.find((element) => {
          //     if (element.length === 0) return;
          //     return element.length !== 0 ?? element;
          //   });
          //   console.log(jtcchannels);
          //   if (jtcchannels) {
          //     const joinTime = moment(jtcchannels.lastJoinedTime);
          //     console.log(jtcchannels.lastJoinedTime);
          //     const currentTime = moment();
          //     const diffInMinutes = currentTime.diff(joinTime, "seconds");
          //     if (diffInMinutes <= 10) {
          //       console.log("Channel joined in the last 10 minutes");
          //     } else {
          //       console.log("Channel not joined in the last 10 minutes");
          //       await client.channels
          //         .fetch(jtcchannels.channel)
          //         .then(async (channel) => {
          //           await channel.delete();
          //           await setupDB.updateOne(
          //             {
          //               GuildID: guild.id,
          //             },
          //             { $pull: { JTCInfo: { owner: jtcchannels.owner } } }
          //           );
          //         })
          //         .catch(() => {
          //           return;
          //         });
          //     }
          //   }
          // }
        } catch {
          return;
        }

        // If the channel has been inactive for more than 10 minutes, delete it and its document
        // cron.schedule("*/1 * * * *", function () {
        //   channel.send({ content: "testing" });
        // });
        // console.log(`The bot is connected to the guild with ID ${guild.id}`);
      });
    });
  },
};
