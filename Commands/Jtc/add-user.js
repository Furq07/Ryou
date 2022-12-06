const {
  EmbedBuilder,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "add-user",
  description: "Adds a user to your custom vc",
  options: [
    {
      name: "user",
      description: "Select user to add to your custom vc",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async execute(interaction, client) {
    const user = interaction.options.getMember("user");
    const setupData = await setupDB.findOne({ GuildID: interaction.guild.id });
    const isFound = setupData.JTCInfo.some((element) => {
      if (element.owner === interaction.member.id) {
        return true;
      } else {
        return false;
      }
    });
    if (isFound === false)
      return interaction.reply({
        content: "You dont own any custom vc yet",
        ephemeral: true,
      });
    const userLimitIsFound = setupData.JTCInfo.find((element) => {
      if (element.owner === interaction.user.id) {
        return element;
      }
    });

    if (
      interaction.guild.channels.cache
        .get(userLimitIsFound.channels)
        .permissionsFor(user.id)
        .has("Connect")
    )
      return interaction.reply({
        content: "You have already added this user into your vc",
        ephemeral: true,
      });
    if (userLimitIsFound.hidden === true) {
      interaction.guild.channels.cache
        .get(userLimitIsFound.channels)
        .permissionOverwrites.edit(user.id, {
          Connect: true,
          Speak: true,
          ViewChannel: true,
        })
        .then(async () => {
          if (!jtcusers) {
            await setupDB.updateOne(
              {
                GuildID: interaction.guild.id,
                "JTCInfo.owner": interaction.user.id,
              },
              {
                $addToSet: {
                  "JTCInfo.$.users": { id: user.id },
                },
              }
            );
          }
          if (userLimitIsFound.users) {
            var size = Object.keys(userLimitIsFound.users).length;
          }
          if (size == 0) {
            size = 1;
          } else {
            size = size + 1;
          }
          if (
            size >=
              interaction.guild.channels.cache.get(userLimitIsFound.channels)
                .userLimit &&
            interaction.guild.channels.cache.get(userLimitIsFound.channels)
              .userLimit !== 0
          ) {
            interaction.guild.channels.cache
              .get(userLimitIsFound.channels)
              .setUserLimit(
                interaction.guild.channels.cache.get(userLimitIsFound.channels)
                  .userLimit + 1
              );
            await setupDB.updateOne(
              {
                GuildID: interaction.guild.id,
                "JTCInfo.owner": interaction.user.id,
              },
              {
                $set: {
                  "JTCInfo.$.userLimit":
                    interaction.guild.channels.cache.get(
                      userLimitIsFound.channels
                    ).userLimit + 1,
                },
              }
            );
          }
        });

      interaction
        .reply({
          content: `Successfully added ${user} to your custom vc`,
          ephemeral: true,
        })
        .catch((err) => {
          return;
        });
    } else {
      interaction.guild.channels.cache
        .get(userLimitIsFound.channels)
        .permissionOverwrites.edit(user.id, {
          Connect: true,
          Speak: true,
          ViewChannel: true,
        })
        .then(async () => {
          if (userLimitIsFound.users !== user.id) {
            await setupDB.updateOne(
              {
                GuildID: interaction.guild.id,
                "JTCInfo.owner": interaction.user.id,
              },
              {
                $addToSet: {
                  "JTCInfo.$.users": { id: user.id },
                },
              }
            );
          }
          if (userLimitIsFound.users) {
            var size = Object.keys(userLimitIsFound.users).length;
          }
          if (size == 0) {
            size = 1;
          } else {
            size = size + 1;
          }
          if (
            size >=
              interaction.guild.channels.cache.get(userLimitIsFound.channels)
                .userLimit &&
            interaction.guild.channels.cache.get(userLimitIsFound.channels)
              .userLimit !== 0
          ) {
            interaction.guild.channels.cache
              .get(userLimitIsFound.channels)
              .setUserLimit(
                interaction.guild.channels.cache.get(userLimitIsFound.channels)
                  .userLimit + 1
              );
            await setupDB.updateOne(
              {
                GuildID: interaction.guild.id,
                "JTCInfo.owner": interaction.user.id,
              },
              {
                $set: {
                  "JTCInfo.$.userLimit":
                    interaction.guild.channels.cache.get(
                      userLimitIsFound.channels
                    ).userLimit + 1,
                },
              }
            );
          }
        });

      interaction
        .reply({
          content: `Successfully added ${user} to your custom vc`,
          ephemeral: true,
        })
        .catch((err) => {
          return;
        });
    }
  },
};
