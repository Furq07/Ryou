const setupDB = require("../../src/models/setupDB");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  PermissionsBitField,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
module.exports = {
  name: "setup-jtc",
  userPermissions: [PermissionsBitField.Flags.Administrator],
  description: "Setup Join to Create system in your server",
  async execute(interaction, client) {
    const { guild, channel, member } = interaction;
    let setupData = await setupDB.findOne({ GuildID: guild.id });
    if (!setupData)
      return interaction.reply({
        content: "I have not been setuped yet",
        ephemeral: true,
      });
    if (setupData.JTCChannelID)
      return interaction.reply({
        content: "Join to Create has already been setuped on this server",
        ephemeral: true,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("resetup-jtc-button")
              .setLabel("Resetup")
              .setStyle(ButtonStyle.Success)
          ),
        ],
      });
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#800000")
          .setTitle("Setup Join to Create")
          .setDescription(
            "You are going to setup join to create system in your server\n\nPress the button below to start the setup"
          ),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("set-jtc-button")
            .setLabel("Start")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
    const collector = interaction.channel.createMessageComponentCollector({
      type: ComponentType.Button,
      time: 60000,
    });
    collector.on("collect", async (collected) => {
      if (collected.user.id !== member.id) {
        collected.reply({
          content: `These Buttons aren't for You!`,
          ephemeral: true,
        });
      }
      if (["set-jtc-button"].includes(collected.customId)) {
        if (collected.customId == "set-jtc-button") {
          const everyone = interaction.guild.roles.cache.find(
            (x) => x.name === "@everyone"
          );

          collected.guild.channels
            .create({
              name: "Custom Vcs",
              type: ChannelType.GuildCategory,
              permissionOverwrites: [
                {
                  id: everyone.id,
                  allow: [
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Speak,
                    PermissionFlagsBits.ViewChannel,
                  ],
                },
              ],
            })
            .then(async (categoryName) => {
              interaction.guild.channels
                .create({
                  name: "jtc-setting",
                  type: ChannelType.GuildText,
                  parent: categoryName,
                  permissionOverwrites: [
                    {
                      id: everyone.id,
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
                  channel.send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor("#800000")
                        .setTitle("Join to Create Setting/Accessibility")
                        .setDescription(
                          "You can manage your custom voice channels through the buttons below"
                        ),
                    ],
                    components: [
                      new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("jtc-delete-vc-button")
                          .setLabel("Delete Vc")
                          .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                          .setCustomId("jtc-rename-vc-button")
                          .setLabel("Rename Vc")
                          .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                          .setCustomId("jtc-user-limit-button")
                          .setLabel("User Limit")
                          .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                          .setCustomId("jtc-lock-channel-button")
                          .setLabel("Lock Vc")
                          .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                          .setCustomId("jtc-unlock-channel-button")
                          .setLabel("Unlock Vc")
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
                          .setLabel("Hide Vc")
                          .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                          .setCustomId("jtc-unhide-button")
                          .setLabel("Unhide vc")
                          .setStyle(ButtonStyle.Primary)
                      ),
                    ],
                  });
                  interaction.guild.channels
                    .create({
                      name: `Join to Create`,
                      type: ChannelType.GuildVoice,
                      parent: categoryName,
                      userLimit: 1,
                    })
                    .then(async (channel) => {
                      await setupDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { JTCChannelID: channel.id }
                      );
                      await setupDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { JTCCategoryID: categoryName.id }
                      );
                    });
                });
              collected.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("set-jtc-button")
                      .setLabel("Setuped")
                      .setStyle(ButtonStyle.Success)
                      .setDisabled(true)
                  ),
                ],
              });
            });
        }
      }
    });
  },
};
