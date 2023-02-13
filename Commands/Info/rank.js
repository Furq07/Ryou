const {
  AttachmentBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const levelDB = require("../../src/models/levelDB");
const canvacord = require("canvacord");

module.exports = {
  name: "rank",
  description: "Check your Rank Card or Someone Else's",
  options: [
    {
      name: "member",
      description: "Select an User.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],

  async execute(client, interaction, args) {
    const { member, options } = interaction;
    const Member = options.getMember("member") || member;
    if (Member === member.bot)
      return interaction.reply({
        content: "I don't think you are mentioning an human being.",
      });
    let levelData = await levelDB.findOne({ MemberID: Member.id });
    if (!levelData)
      return interaction.reply(
        `${Member} Never in his Life Tried my Command, What is he DOING!`
      );

    const reqXP = levelData.Level * levelData.Level * 100 + 100;
    await interaction.deferReply();
    const rank = new canvacord.Rank()
      .setAvatar(Member.user.displayAvatarURL({ dynamic: true, format: "png" }))
      .setCurrentXP(levelData.XP)
      .setRequiredXP(reqXP)
      .setLevel(levelData.Level)
      .setRank(1, "RANK", false)
      .setStatus("offline")
      .setProgressBar(["#000000", "#FF0000"], "GRADIENT")
      .setBackground(
        "IMAGE",
        "https://media.discordapp.net/attachments/744545345312129035/1031574867121803354/hoin_hoink.jpg"
      )
      .setUsername(Member.user.username)
      .setDiscriminator(Member.user.discriminator, "#A9A9A9");
    rank.build().then((data) => {
      const attachment = new AttachmentBuilder(data, "rank.png");
      interaction.editReply({ files: [attachment] });
    });
  },
};
