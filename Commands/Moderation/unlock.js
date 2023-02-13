const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "unlock",
  description: "This Command Unlocks Member from Server!",
  userPermissions: [PermissionsBitField.Flags.ManageChannels],
  support: true,
  options: [
    {
      name: "channel",
      description: "Provide The Channel you want to Unlock.",
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],
  async execute(interaction, client) {
    const { channel, guild, options } = interaction;
    const Channel = options.getChannel("channel") || channel;
    let setupData = setupDB.findOne({ GuildID: guild.id });
    const role = guild.roles.cache.find((r) => r.id === setupData.mainRoleID);

    await Channel.permissionOverwrites.edit(role, { SEND_MESSAGES: true });

    const unlockEmbed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle("Channel Unlocked!")
      .setDescription(`🔓 | Successfully Unlocked The ${Channel}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      });

    interaction.reply({ embeds: [unlockEmbed] });
  },
};
