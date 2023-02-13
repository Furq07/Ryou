const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");

module.exports = {
  name: "lock",
  description: "This Command Locks Channel!",
  userPermissions: [PermissionsBitField.Flags.ManageChannels],
  support: true,
  options: [
    {
      name: "channel",
      description: "Provide The Channel you want to Lock.",
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],
  async execute(interaction, client) {
    const { channel, guild, options } = interaction;
    const Channel = options.getChannel("channel") || channel;
    let setupData = setupDB.findOne({ GuildID: guild.id });
    const role = guild.roles.cache.find((r) => r.id === setupData.mainRoleID);
    await Channel.permissionOverwrites.edit(role, { SEND_MESSAGES: false });

    const lockEmbed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle("Channel Locked!")
      .setDescription(`🔒 | Successfully Locked The ${Channel}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      });

    interaction.reply({ embeds: [lockEmbed] });
  },
};
