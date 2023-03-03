const {
  ChannelType,
  PermissionFlagsBits,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const setupDB = require("../../../src/models/setupDB");

module.exports = {
  name: "channelDelete",
  async execute(channel, client) {
    let setupData = await setupDB.findOne({ GuildID: channel.guild.id });
    if (!setupData || !setupData.JTCChannelID) return;
    const jtcCategory = channel.guild.channels.cache.get(
      setupData.JTCCategoryID
    );
    const jtcSettingChannel = channel.guild.channels.cache.get(
      setupData.JTCSettingID
    );
    const jtcChannel = channel.guild.channels.cache.get(setupData.JTCChannelID);
    const jtcAdminSettingChannel = channel.guild.channels.cache.get(
      setupData.JTCAdminSettingID
    );
    const jtcLogsChannel = channel.guild.channels.cache.get(
      setupData.JTCLogsID
    );

    if (
      setupData.Resetting === true ||
      setupData.Resetting ||
      setupData.JTCAutoRecover === false
    )
      return;

    if (channel.id === setupData.JTCChannelID) {
      if (jtcCategory) {
        await channel.guild.channels
          .create({
            name: `Join to Create`,
            type: ChannelType.GuildVoice,
            parent: setupData.JTCCategoryID,
            userLimit: 1,
          })
          .then(async (channel) => {
            await setupDB.findOneAndUpdate(
              { GuildID: channel.guild.id },
              { JTCChannelID: channel.id }
            );
            await channel.setPosition(2);
          });
      }
    } else if (channel.id === setupData.JTCSettingID) {
      if (jtcCategory) {
        await channel.guild.channels
          .create({
            name: "jtc-settings",
            type: ChannelType.GuildText,
            parent: setupData.JTCCategoryID,
            permissionOverwrites: [
              {
                id: channel.guild.roles.everyone.id,
                deny: [PermissionFlagsBits.SendMessages],
                allow: [PermissionFlagsBits.ViewChannel],
              },
            ],
          })
          .then(async (channel) => {
            await setupDB.findOneAndUpdate(
              { GuildID: channel.guild.id },
              { JTCSettingID: channel.id }
            );
            await channel
              .send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("#800000")
                    .setTitle("Join to Create Settings")
                    .setDescription(
                      "You can manage your Custom VCs Using the Buttons Below!"
                    ),
                ],
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("jtc-delete-vc-button")
                      .setLabel("Delete VC")
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId("jtc-rename-vc-button")
                      .setLabel("Rename VC")
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId("jtc-user-limit-button")
                      .setLabel("User Limit")
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId("jtc-lock-channel-button")
                      .setLabel("Lock VC")
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId("jtc-unlock-channel-button")
                      .setLabel("Unlock VC")
                      .setStyle(ButtonStyle.Primary)
                  ),
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("jtc-add-user-button")
                      .setLabel("Add User")
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId("jtc-remove-user-button")
                      .setLabel("Remove User")
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId("jtc-hide-button")
                      .setLabel("Hide VC")
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId("jtc-unhide-button")
                      .setLabel("Unhide VC")
                      .setStyle(ButtonStyle.Primary)
                  ),
                ],
              })
              .then(async (message) => {
                await setupDB.findOneAndUpdate(
                  { GuildID: channel.guild.id },
                  { JTCSettingMessageID: message.id }
                );
              });
          });
      }
    } else if (channel.id === setupData.JTCCategoryID) {
      await channel.guild.channels
        .create({
          name: "JTC VCs",
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: channel.guild.roles.everyone.id,
              allow: [
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.ViewChannel,
              ],
            },
          ],
        })
        .then(async (categoryName) => {
          await setupDB.findOneAndUpdate(
            { GuildID: channel.guild.id },
            { JTCCategoryID: categoryName.id }
          );
          await jtcSettingChannel
            .setParent(categoryName.id, {
              lockPermissions: false,
            })
            .then(async (channel) => {
              channel.setPosition(1);
            });

          await jtcAdminSettingChannel
            .setParent(categoryName.id, {
              lockPermissions: false,
            })
            .then(async (channel) => {
              channel.setPosition(2);
            });
          if (setupData.JTCLogsEnabled === true) {
            await jtcLogsChannel.setParent(categoryName.id, {
              lockPermissions: false,
            });
          }
          await jtcChannel
            .setParent(categoryName.id, {
              lockPermissions: true,
            })
            .then(async (channel) => {
              channel.setPosition(setupData.JTCLogsID ? 4 : 3);
            });
          setupData.JTCInfo.forEach(async (owner) => {
            await channel.guild.channels.cache
              .find((r) => r.id === owner.channel)
              .setParent(categoryName.id, {
                lockPermissions: false,
              });
          });
        });
    }
  },
};
