const {
  InteractionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, type, fields } = interaction;
    const setupData = await setupDB.findOne({ GuildID: interaction.guild.id });
    if (
      type == InteractionType.ModalSubmit &&
      customId === "jtc-update-user-limit-modal"
    ) {
      const newUserLimitInputValue = fields.getTextInputValue(
        "jtc-update-user-limit-input"
      );
      const input = parseInt(newUserLimitInputValue);
      const userChannelIsFound = setupData.JTCInfo.find((element) => {
        if (element.owner === interaction.user.id) {
          return element.channels;
        }
      });

      if (isNaN(input)) {
        interaction
          .update({
            content: "Provide an integer, try again",
            ephemeral: true,
            embeds: [],
          })
          .then(() => {
            return;
          });
      } else {
        if (userChannelIsFound.users) {
          var size = Object.keys(userChannelIsFound.users).length;
        }
        if (input < size + 1 && input !== 0) {
          await interaction.reply({
            content:
              "User limit less than your channels members is not allowed, set some higher limit",
            ephemeral: true,
          });
        } else {
          let userLimit = interaction.guild.channels.cache.get(
            userChannelIsFound.channels
          ).userLimit;
          if (input == 0) {
            userLimit = "Unlimited";
          } else {
            userLimit = interaction.guild.channels.cache.get(
              userChannelIsFound.channels
            ).userLimit;
          }
          interaction.guild.channels.cache
            .find((r) => r.id === userChannelIsFound.channels)
            .setUserLimit(newUserLimitInputValue);
          await setupDB.updateOne(
            {
              GuildID: interaction.guild.id,
              "JTCInfo.owner": interaction.user.id,
            },
            {
              $set: {
                "JTCInfo.$.userLimit":
                  newUserLimitInputValue == 0
                    ? userLimit
                    : newUserLimitInputValue,
              },
            }
          );
          // future purposes
          // if (!userChannelIsFound.userLimitChanged) {
          //   await setupDB.updateOne(
          //     {
          //       GuildID: interaction.guild.id,
          //       "JTCInfo.owner": interaction.user.id,
          //     },
          //     {
          //       $set: {
          //         "JTCInfo.$.userLimitChanged": true,
          //       },
          //     }
          //   );
          // }

          interaction
            .reply({
              content: "",
              embeds: [
                new EmbedBuilder()
                  .setColor("#800000")
                  .setTitle("Changed custom vc user limit")
                  .setDescription(
                    `You have successfully changed your user limit of your custom vc\n\n**Vc Information**\n**Name**: <#${
                      userChannelIsFound.channels
                    }>\n**ID**: ${
                      userChannelIsFound.channels
                    }\n**New User Limit**: ${
                      newUserLimitInputValue == 0
                        ? userLimit
                        : newUserLimitInputValue
                    }`
                  ),
              ],
              components: [],
              ephemeral: true
            })
            .catch((err) => {
              return;
            });
        }
      }
    }
  },
};
