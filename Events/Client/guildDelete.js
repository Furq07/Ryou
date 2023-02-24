const { EmbedBuilder } = require("discord.js");
const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "guildDelete",
  async execute(guild, client) {
    guild.members.fetch(guild.ownerId).then(async (user) => {
      user.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Sorry to see you go 😿")
            .setColor("#800000")
            .setDescription(
              `Its really sad to see that you have removed me from your Server,
              Was there a bug or maybe you didn't like something?
              
              Maybe join our [Support Server](https://discord.gg/kF6fqAsHB3) and give us feedback!`
            )
            .setFooter({
              text: "Ryou",
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    });
    await setupDB.deleteMany({ GuildID: guild.id });
  },
};
