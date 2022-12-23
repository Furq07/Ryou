const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ComponentType,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "setup-verification",
  description: "Setup verification system in your server",
  async execute(interaction, client) {
    const { guild, channel } = interaction;
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#800000")
          .setDescription(
            "You are going to setup verification system, select one of the option from the below to start the setup"
          )
          .setTitle("Verification setup"),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("normal-verification-setup-button")
            .setLabel("Normal")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("captcha-verification-setup-button")
            .setLabel("Captcha")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });
    collector.on("collect", async (collected) => {
      if (collected.customId === "captcha-verification-setup-button") {
        collected.guild.channels
          .create({
            name: "Verification",
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
              {
                id: collected.guild.roles.everyone.id,
                allow: [
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ViewChannel,
                ],
              },
            ],
          })
          .then(async (category) => {
            collected.guild.channels.create({
              name: "verify",
              type: ChannelType.GuildText,
              parent: category,
              permissionOverwrites: [
                {
                  id: collected.guild.roles.everyone.id,
                  allow: [
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ViewChannel,
                  ],
                },
              ],
            });
            await setupDB.findOneAndUpdate(
              { GuildID: guild.id },
              { verificationCategoryID: category.id }
            );
          })
          .then(async   (verifyChannel) => {
            verifyChannel.send({
              embed: [
                new EmbedBuilder()
                  .setColor("#800000")
                  .setDescription("Click the button below to verify your self")
                  .setTitle("Captcha Verification"),
              ],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("captcha-verify-button")
                    .setLabel("Verify")
                    .setStyle(ButtonStyle.Success)
                ),
              ],
            });

            await setupDB.findOneAndUpdate(
              { GuildID: guild.id },
              { captchaVerificationChannelID: verifyChannel.id }
            );
            collected.update({
              embeds: [
                new EmbedBuilder()
                  .setColor("#800000")
                  .setDescription(
                    "Successfully setuped captcha verification system"
                  )
                  .setTitle("Verificaion setuped"),
              ],
            });
          });
      }
    });
  },
};
