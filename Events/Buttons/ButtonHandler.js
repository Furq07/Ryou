const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ComponentType,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const captchaDB = require("../../src/models/captchaDB");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    const { customId, guild, message } = interaction;
    let captchaData = await captchaDB.findOne({ GuildID: guild.id });
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    if (
      [
        "unban-button",
        "send-invite-button",
        "captcha-verify",
        "verification-resetup",
      ].includes(customId)
    ) {
      switch (customId) {
        case "unban-button":
          message.embeds.forEach(async (embed) => {
            const userID = embed.fields[1].value;
            guild.members
              .unban(`${userID}`)
              .then(() => {
                interaction.update({
                  components: [
                    new ActionRowBuilder().addComponents(
                      new ButtonBuilder()
                        .setCustomId("unban-button")
                        .setLabel("Unbanned")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true)
                    ),
                  ],
                });
              })
              .catch(() => {
                return interaction.reply({
                  ephemeral: true,
                  content: "This user is already unbanned",
                });
              });
          });

          break;
        case "send-invite-button":
          message.embeds.forEach(async (embed) => {
            const userID = embed.fields[0].value;
            let invite = await message.channel.createInvite({
              maxAge: 0,
              maxUses: 1,
            });
            client.users
              .send(`${userID}`, `${invite}`)
              .then(() => {
                interaction.update({
                  components: [
                    new ActionRowBuilder().addComponents(
                      new ButtonBuilder()
                        .setCustomId("send-invite-button")
                        .setLabel("Sent")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true)
                    ),
                  ],
                });
              })
              .catch(() => {
                return interaction.reply({
                  ephemeral: true,
                  content: "This user don't accept direct DM",
                });
              });
          });
          break;
        case "captcha-verify":
          const changeuserModal = new ModalBuilder()
            .setCustomId(`captcha-modal`)
            .setTitle(`Captcha verification`);

          const changeUserLimitTextInput = new TextInputBuilder()
            .setCustomId(`captcha-verify-input`)
            .setLabel(`Enter the code below`)
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Captcha code (eg: 9cwsk)")
            .setMaxLength(5)
            .setMinLength(5);
          changeuserModal.addComponents(
            new ActionRowBuilder().addComponents(changeUserLimitTextInput)
          );
          interaction.showModal(changeuserModal);
          break;
        case "verification-resetup":
          if (setupData.VerificationType === "Normal") {
            interaction.update({
              ephemeral: true,
              content:
                "You have setuped the normal verification system, do you want to shift to captcah verification or not",
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("yes-shift-to-captcha-verification")
                    .setLabel("Yes")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId("no-shift-to-captcha-verification")
                    .setLabel("No")
                    .setStyle(ButtonStyle.Primary)
                ),
              ],
            });
            const collector =
              interaction.channel.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 60000,
              });
            collector.on("collect", async (collected) => {
              if (collected.customId === "yes-shift-to-captcha-verification") {
                if (!captchaData) {
                  new captchaDB({
                    GuildID: guild.id,
                  }).save();
                }
                collected.guild.channels.cache
                  .get(`${setupData.VerificationChannelID}`)
                  .delete();
                collected.guild.channels.cache
                  .get(`${setupData.verificationCategoryID}`)
                  .delete()
                  .then(async () => {
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
                                    .setDescription(
                                      "Click the button below to verify your self"
                                    )
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
                              })
                              .then(async (message) => {
                                await setupDB.findOneAndUpdate(
                                  { GuildID: guild.id },
                                  { VerificationMessageID: message.id }
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
                            await setupDB.findOneAndUpdate(
                              { GuildID: guild.id },
                              { VerificationChannelID: verifyChannel.id }
                            );
                            await setupDB.findOneAndUpdate(
                              { GuildID: guild.id },
                              { verificationCategoryID: category.id }
                            );
                            await setupDB.findOneAndUpdate(
                              { GuildID: guild.id },
                              { VerificationType: "Captcha" }
                            );
                          });
                      });
                  });
              } else {
                collected.update({ components: [] });
              }
            });
          } else if (setupData.VerificationType === "Captcha") {
            interaction.update({
              ephemeral: true,
              content:
                "You have setuped the captcha verification system, choose your new verification system from below to start the setup",
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("yes-shift-to-normal-verification")
                    .setLabel("Yes")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId("no-shift-to-normal-verification")
                    .setLabel("No")
                    .setStyle(ButtonStyle.Primary)
                ),
              ],
            });
            const collector2 =
              interaction.channel.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 60000,
              });

            collector2.on("collect", async (collected) => {
              if (collected.customId === "yes-shift-to-normal-verification") {
                collected.guild.channels.cache
                  .get(`${setupData.VerificationChannelID}`)
                  .delete();
                collected.guild.channels.cache
                  .get(`${setupData.verificationCategoryID}`)
                  .delete()
                  .then(async () => {
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
                                    .setDescription(
                                      "Click the button below to verify your self"
                                    )
                                    .setTitle("Verification"),
                                ],
                                components: [
                                  new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                      .setCustomId("normal-verify-button")
                                      .setLabel("Verify")
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

                            collected.update({
                              embeds: [
                                new EmbedBuilder()
                                  .setColor("#800000")
                                  .setDescription(
                                    "Successfully re-setuped normal verification system"
                                  )
                                  .setTitle("Verificaion re-setuped"),
                              ],
                              components: [],
                            });
                            await setupDB.findOneAndUpdate(
                              { GuildID: guild.id },
                              { VerificationChannelID: verifyChannel.id }
                            );
                            await setupDB.findOneAndUpdate(
                              { GuildID: guild.id },
                              { verificationCategoryID: category.id }
                            );
                            await setupDB.findOneAndUpdate(
                              { GuildID: guild.id },
                              { VerificationType: "Normal" }
                            );
                            await captchaDB.deleteOne({ GuildID: guild.id });
                          });
                      });
                  });
              } else {
                collected.update({ components: [] });
              }
            });
          }
          break;
      }
    }
  },
};
