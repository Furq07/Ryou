const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const translate = require("@iamtraction/google-translate");
module.exports = {
  name: "translate",
  description: "Transate your text",
  options: [
    {
      name: "text",
      description: "Enter your text",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "language",
      autocomplete: true,
      description: "Select your language",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async execute(interaction, client) {
    let text = interaction.options.getString("text");
    let language = interaction.options.getString("language");
    const languages = [
      {
        code: "en",
        name: "English",
      },
      {
        code: "es",
        name: "Spanish",
      },
      {
        code: "fr",
        name: "French",
      },
      {
        code: "hr",
        name: "Croatian",
      },
      {
        code: "ar",
        name: "Arabic",
      },
      {
        code: "ru",
        name: "Russian",
      },
      {
        code: "de",
        name: "German",
      },
      {
        code: "pt",
        name: "Portuguese",
      },
      {
        code: "ja",
        name: "Japanese",
      },
      {
        code: "it",
        name: "Italian",
      },
      {
        code: "nl",
        name: "Dutch",
      },
      {
        code: "ko",
        name: "Korean",
      },
      {
        code: "el",
        name: "Greek",
      },
      {
        code: "pl",
        name: "Polish",
      },
      {
        code: "tr",
        name: "Turkish",
      },
      {
        code: "sv",
        name: "Swedish",
      },
      {
        code: "da",
        name: "Danish",
      },
      {
        code: "hi",
        name: "Hindi",
      },
      {
        code: "fi",
        name: "Finnish",
      },
      {
        code: "cs",
        name: "Czech",
      },
      {
        code: "sk",
        name: "Slovak",
      },
      {
        code: "hu",
        name: "Hungarian",
      },
      {
        code: "th",
        name: "Thai",
      },
      {
        code: "ro",
        name: "Romanian",
      },
    ];
    if (language) {
      languages.find((element) => {
        if (element.name === language) {
          translate(text, { to: `${element.code}` })
            .then(async (res) => {
              await interaction.channel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("#800000")
                    .setTitle("Ryou Translator")
                    .addFields(
                      { name: "To:", value: `${element.name}` },
                      {
                        name: "Original:",
                        value: `\`\`\`${text}\`\`\``,
                      },
                      {
                        name: "Translated:",
                        value: `\`\`\`${res.text}\`\`\``,
                      }
                    )
                    .setFooter({
                      text: "Ryou - Fun",
                      iconURL: client.user.displayAvatarURL({ dynamic: true }),
                    }),
                ],
              });
            })
            .catch((err) => {
              return;
            });
        }
      });
    }
  },
};
