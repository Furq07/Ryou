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
      customId === "jtc-change-name-modal"
    ) {
      const renameChannelInputValue = fields.getTextInputValue(
        "jtc-change-name-input"
      );
      const userChannelIsFound = setupData.JTCInfo.find((element) => {
        if (element.owner === interaction.user.id) {
          return element.channels;
        }
      });
      const bad_words = [
        "fucker",
        "anal",
        "anus",
        "arse",
        "ass",
        "b1tch",
        "ballsack",
        "bastard",
        "bitch",
        "biatch",
        "blowjob",
        "bollock",
        "bollok",
        "boner",
        "boob",
        "boobs",
        "buttplug",
        "clitoris",
        "cock",
        "cum",
        "cunt",
        "dick",
        "dildo",
        "dyke",
        "erection",
        "fag",
        "faggot",
        "feck",
        "fellate",
        "fellatio",
        "felching",
        "fuck",
        "fucks",
        "fudgepacker",
        "genitals",
        "hell",
        "jerk",
        "jizz",
        "knobend",
        "labia",
        "masturbate",
        "muff",
        "nigger",
        "nigga",
        "penis",
        "piss",
        "poop",
        "pube",
        "pussy",
        "queer",
        "scrotum",
        "sex",
        "shit",
        "sh1t",
        "slut",
        "smegma",
        "spunk",
        "tit",
        "tranny",
        "trannies",
        "tosser",
        "turd",
        "twat",
        "vagina",
        "wank",
        "whore",
        "tits",
        "titty",
        "asshole",
        "fvck",
        "asshat",
        "pu55y",
        "pen1s",
        "Fo",
      ];

      if (bad_words.includes(renameChannelInputValue))
        return interaction.update({
          content: `That word is a profane word, which is not allowed `,
          components: [],
          embeds: [],
        });

      interaction.guild.channels.cache
        .find((r) => r.id === userChannelIsFound.channels)
        .setName(renameChannelInputValue);

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#800000")
            .setTitle("Renamed your custom vc")
            .setDescription(
              `You have successfully renamed your custom vc\n\n**Vc Information**\n**New name**: <#${userChannelIsFound.channels}>\n**ID**: ${userChannelIsFound.channels}`
            ),
        ],
        components: [],
        ephemeral: true
      });
    }
  },
};
