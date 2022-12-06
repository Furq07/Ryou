const {
  EmbedBuilder,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "remove-user",
  description: "Removes a user from your custom vc",
  options: [
    {
      name: "user",
      description: "Select user to remove from your custom vc",
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
        return element.channels;
      }
    });
    if (
      !interaction.guild.channels.cache
        .get(userLimitIsFound.channels)
        .permissionsFor(user.id)
        .has("Connect")
    )
      return interaction.reply({
        content: "You have already removed this user from your vc",
        ephemeral: true,
      });
    if (userLimitIsFound.hidden === true) {
      interaction.guild.channels.cache
        .get(userLimitIsFound.channels)
        .permissionOverwrites.edit(user.id, {
          Connect: false,
          Speak: false,
          ViewChannel: false,
        })
        .then(async () => {
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
            if (
              interaction.guild.channels.cache.get(userLimitIsFound.channels)
                .userLimit !== 0
            ) {
              interaction.guild.channels.cache
                .get(userLimitIsFound.channels)
                .setUserLimit(
                  interaction.guild.channels.cache.get(
                    userLimitIsFound.channels
                  ).userLimit - 1
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
                      ).userLimit - 1,
                  },
                }
              );
            }
          }

          interaction.reply({
            content: `Successfully removed ${user} from your custom vc`,
            ephemeral: true,
          });
        });
    } else {
      interaction.guild.channels.cache
        .get(userLimitIsFound.channels)
        .permissionOverwrites.edit(user.id, {
          Connect: false,
          Speak: false,
        })
        .then(async () => {
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
            if (
              interaction.guild.channels.cache.get(userLimitIsFound.channels)
                .userLimit !== 0
            ) {
              interaction.guild.channels.cache
                .get(userLimitIsFound.channels)
                .setUserLimit(
                  interaction.guild.channels.cache.get(
                    userLimitIsFound.channels
                  ).userLimit - 1
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
                      ).userLimit - 1,
                  },
                }
              );
            }
          }
          interaction.reply({
            content: `Successfully removed ${user} from your custom vc`,
            ephemeral: true,
          });
        });
    }
  },
};
