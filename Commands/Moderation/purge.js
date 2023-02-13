const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const wait = require("util").promisify(setTimeout);

module.exports = {
  name: "purge",
  description: "This Command Deletes Multiple Messages from Server!",
  userPermissions: [PermissionsBitField.Flags.ManageMessages],
  options: [
    {
      name: "amount",
      description: "Provide Amount of Messages You want to Delete!",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "10 Messages", value: "10" },
        { name: "20 Messages", value: "20" },
        { name: "30 Messages", value: "30" },
        { name: "40 Messages", value: "40" },
        { name: "50 Messages", value: "50" },
        { name: "60 Messages", value: "60" },
        { name: "70 Messages", value: "70" },
        { name: "80 Messages", value: "80" },
        { name: "90 Messages", value: "90" },
        { name: "100 Messages", value: "99" },
      ],
    },
    {
      name: "member",
      description:
        "Provide an User if you want to Delete Message of that User Only!",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],

  async execute(interaction, client) {
    const { channel, options, guild } = interaction;
    const amount = options.getString("amount");
    const Target = options.getMember("member");
    const Amount = parseInt(amount);

    const Messages = await channel.messages.fetch();

    const Response = new EmbedBuilder()
      .setColor("#800000")
      .setTitle("Purge Complete!")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Moderation",
      });

    if (Target) {
      let i = 0;
      const filtered = [];
      (await Messages).filter((m) => {
        if (m.author.id === Target.id && Amount > i) {
          filtered.push(m);
          i++;
        }
      });
      await channel.bulkDelete(filtered, true).then(async (messages) => {
        Response.setDescription(
          `🧹 | Deleted ${messages.size} messages from ${Target}.`
        );
        interaction.reply({ embeds: [Response] });
        await wait(10000);
        await interaction.deleteReply();
      });
    } else {
      await channel.bulkDelete(Amount, true).then(async (messages) => {
        Response.setDescription(
          `🧹 | Deleted ${messages.size} messages from ${channel}`
        );
        await interaction.reply({ embeds: [Response] });
        await wait(10000);
        await interaction.deleteReply();
      });
    }
  },
};
