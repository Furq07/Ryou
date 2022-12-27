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
const captchaDB = require("../../src/models/captchaDB");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "setup-verification",
  description: "Setup verification system in your server",
  async execute(interaction, client) {
    const { guild, channel } = interaction;
    let captchaData = await captchaDB.findOne({ GuildID: guild.id });
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    if (setupData.VerificationSetuped === true)
      return interaction.reply({
        content: "Verification is already setuped",
        ephemeral: true,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("verification-resetup")
              .setLabel("Resetup")
              .setStyle(ButtonStyle.Success)
          ),
        ],
      });
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
        if (!captchaData) {
          new captchaDB({
            GuildID: guild.id,
          }).save();
        }
        collected.guild.channels
          .create({
            name: "Verification",
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
              {
                id: collected.guild.roles.everyone.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: setupData.CommunityRoleID,
                deny: [
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ViewChannel,
                ],
              },
            ],
          })
          .then(async (category) => {
            collected.guild.channels
              .create({
                name: "verify",
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                  {
                    id: collected.guild.roles.everyone.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                  },
                  {
                    id: setupData.CommunityRoleID,
                    deny: [
                      PermissionFlagsBits.SendMessages,
                      PermissionFlagsBits.ViewChannel,
                    ],
                  },
                ],
              })
              .then(async (verifyChannel) => {
                verifyChannel
                  .send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor("#800000")
                        .setTitle("⚠ Verification Required")
                        .setDescription(
                          `In order to get the \`${guild.name}\` access, verify yourself using \n**Verify** button`
                        ),
                    ],
                    components: [
                      new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("captcha-verify-button")
                          .setLabel("Verify")
                          .setEmoji("✅")
                          .setStyle(ButtonStyle.Success)
                      ),
                    ],
                  })
                  .then(async (message) => {
                    await setupDB.findOneAndUpdate(
                      { GuildID: guild.id },
                      { VerificationMessageID: message.id }
                    );
                    await setupDB.findOneAndUpdate(
                      { GuildID: guild.id },
                      { VerificationChannelID: verifyChannel.id }
                    );
                    await setupDB.findOneAndUpdate(
                      { GuildID: guild.id },
                      { VerificationCategoryID: category.id }
                    );
                    await setupDB.findOneAndUpdate(
                      { GuildID: guild.id },
                      { VerificationSetuped: true }
                    );
                    await setupDB.findOneAndUpdate(
                      { GuildID: guild.id },
                      { VerificationType: "Captcha" }
                    );
                  });
                collected.update({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("#800000")
                      .setDescription(
                        "Successfully setuped captcha verification system"
                      )
                      .setTitle("Verificaion setuped"),
                  ],
                  components: [],
                });
              });
          });
      } else if (collected.customId === "normal-verification-setup-button") {
        collected.guild.channels
          .create({
            name: "Verification",
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
              {
                id: collected.guild.roles.everyone.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: setupData.CommunityRoleID,
                deny: [
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ViewChannel,
                ],
              },
            ],
          })
          .then(async (category) => {
            collected.guild.channels
              .create({
                name: "verify",
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                  {
                    id: collected.guild.roles.everyone.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                  },
                  {
                    id: setupData.CommunityRoleID,
                    deny: [
                      PermissionFlagsBits.SendMessages,
                      PermissionFlagsBits.ViewChannel,
                    ],
                  },
                ],
              })
              .then(async (verifyChannel) => {
                verifyChannel
                  .send({
                    embeds: [
                      new EmbedBuilder()
                        .setTitle("⚠ Verification Required")
                        .setDescription(
                          `In order to get the \`\`${guild.name}\`\` access, verify yourself using \n**Verify** button`
                        ),
                    ],
                    components: [
                      new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("normal-verify-button")
                          .setLabel("Verify")
                          .setEmoji("✅")
                          .setStyle(ButtonStyle.Success)
                      ),
                    ],
                  })
                  .then(async (message) => {
                    await setupDB.findOneAndUpdate(
                      { GuildID: guild.id },
                      { VerificationMessageID: message.id }
                    );
                  });

                await collected.update({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("#800000")
                      .setDescription(
                        "Successfully setuped normal verification system"
                      )
                      .setTitle("Verificaion setuped"),
                  ],
                  components: [],
                });
                await setupDB.findOneAndUpdate(
                  { GuildID: guild.id },
                  { VerificationChannelID: verifyChannel.id }
                );
                await setupDB.findOneAndUpdate(
                  { GuildID: guild.id },
                  { VerificationCategoryID: category.id }
                );
                await setupDB.findOneAndUpdate(
                  { GuildID: guild.id },
                  { VerificationSetuped: true }
                );
                await setupDB.findOneAndUpdate(
                  { GuildID: guild.id },
                  { VerificationType: "Normal" }
                );
              });
          });
      }
    });
  },
};
