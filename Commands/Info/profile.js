const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const profileDB = require("../../structure/models/profileDB");
module.exports = {
  name: "profile",
  description: "This is an profile command.",
  options: [
    {
      name: "create",
      description: "Creates an profile for you!",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "view",
      description: "see yourself's or someone else's profile",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "member",
          description: "Who's Profile you wanna take a look at?",
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
    },
    {
      name: "settings",
      description: "Change whatever you want in your Profile!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "option",
          description: "What do you wanna change?",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: "Change Real Name", value: "RealName" },
            { name: "Change Age", value: "Age" },
            { name: "Change AboutMe", value: "AboutMe" },
            { name: "Change Pronounce", value: "Pronounce" },
            { name: "Change Gender", value: "Gender" },
          ],
        },
      ],
    },
  ],
  async execute(client, interaction, args) {
    const { member, options, channel } = interaction;
    const embed = new EmbedBuilder()
      .setColor("#800000")
      .setTitle("Create Profile!")
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Info",
      });
    const profileData = await profileDB.findOne({ MemberID: member.id });
    switch (options.getSubcommand()) {
      case "create":
        if (profileData) {
          interaction.reply({
            embeds: [
              embed.setTitle("Change Your Profile!")
                .setDescription(`You have already created your Profile,
              If you would like to change something please use </profile settings:1048565947725795398>
            `),
            ],
            ephemeral: true,
          });
        } else {
          const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("Create")
              .setLabel("Create")
              .setStyle(ButtonStyle.Primary)
              .setEmoji("✅"),
            new ButtonBuilder()
              .setCustomId("Cancel")
              .setLabel("Cancel")
              .setStyle(ButtonStyle.Danger)
              .setEmoji("⛔")
          );
          const collector = channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 300000,
          });
          interaction.reply({
            embeds: [
              embed.setDescription(
                `**Alright, Looks like its time to create your Profile!**
              
              Click on the Create button and Fill all the Boxes in the Popup!
              When you are done click on the Submit Button!`
              ),
            ],
            components: [Buttons],
          });
          collector.on("collect", async (collected) => {
            if (member.id != collected.member.id)
              return collected.reply({
                content: "These buttons aren't for you!",
                ephemeral: true,
              });
            if (["Create", "Cancel"].includes(collected.customId)) {
              switch (collected.customId) {
                case "Create":
                  const CreateProfile = new ModalBuilder()
                    .setCustomId(`CreateProfile`)
                    .setTitle(`Create your Profile!`);
                  const RealNameInput = new TextInputBuilder()
                    .setCustomId(`RealNameInput`)
                    .setLabel(`What's your Real Name?`)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Capt. Jack Sparrow");
                  const AgeInput = new TextInputBuilder()
                    .setCustomId(`AgeInput`)
                    .setLabel(`What's your Age?`)
                    .setMinLength(2)
                    .setMaxLength(2)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder(
                      "Make sure you only Provide the Number, For example: 18"
                    );
                  const AboutMeInput = new TextInputBuilder()
                    .setCustomId(`AboutMeInput`)
                    .setLabel(`Write some lines about your self here!`)
                    .setRequired(true)
                    .setMinLength(50)
                    .setMaxLength(500)
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder(
                      "My name is Capt. Jack Sparrow, Where is the Bloody Rum!"
                    );
                  const PronounceInput = new TextInputBuilder()
                    .setCustomId(`PronounceInput`)
                    .setLabel(`How should we call you?`)
                    .setMinLength(6)
                    .setMaxLength(8)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("He/Him, She/Her");
                  const GenderInput = new TextInputBuilder()
                    .setCustomId(`GenderInput`)
                    .setLabel(`What's your Gender?`)
                    .setMinLength(4)
                    .setMaxLength(12)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Male, Female, Other");
                  const RealNameActonRow = new ActionRowBuilder().addComponents(
                    RealNameInput
                  );
                  const AgeActionRow = new ActionRowBuilder().addComponents(
                    AgeInput
                  );
                  const AboutMeActionRow = new ActionRowBuilder().addComponents(
                    AboutMeInput
                  );
                  const PronounceActionRow =
                    new ActionRowBuilder().addComponents(PronounceInput);
                  const GenderActionRow = new ActionRowBuilder().addComponents(
                    GenderInput
                  );
                  CreateProfile.addComponents(
                    RealNameActonRow,
                    AgeActionRow,
                    AboutMeActionRow,
                    PronounceActionRow,
                    GenderActionRow
                  );
                  await collected.showModal(CreateProfile);
                  const filter = (i) => i.customId === "CreateProfile";
                  interaction
                    .awaitModalSubmit({ filter, time: 300000 })
                    .then((i) => {
                      if (i.member.id !== member.id) return;
                      const RealName =
                        i.fields.getTextInputValue("RealNameInput");
                      const Age = i.fields.getTextInputValue("AgeInput");
                      if (isNaN(Age))
                        return i.reply({
                          content: "Please Provide a Valid Age!",
                          ephemeral: true,
                        });
                      const AboutMe =
                        i.fields.getTextInputValue("AboutMeInput");
                      const Pronounce =
                        i.fields.getTextInputValue("PronounceInput");
                      if (!["He/Him", "She/Her"].includes(Pronounce))
                        return i.reply({
                          content: "Please Provide an Valid Pronounce!",
                          ephemeral: true,
                        });
                      const Gender = i.fields.getTextInputValue("GenderInput");
                      if (!["Male", "Female", "Other"].includes(Gender))
                        return i.reply({
                          content: "Please provide an Valid Gender!",
                          ephemeral: true,
                        });
                      i.update({
                        embeds: [
                          embed
                            .setAuthor({
                              name: `${member.user.username}'s Profile`,
                              iconURL: member.user.displayAvatarURL(),
                            })
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTitle(`\`${Pronounce}\` ${RealName}`)
                            .setDescription(null)
                            .setFields(
                              { name: "Age:", value: `${Age}`, inline: true },
                              {
                                name: "Gender:",
                                value: `${Gender}`,
                                inline: true,
                              },
                              { name: "About Me:", value: `${AboutMe}` }
                            ),
                        ],
                        components: [],
                      });
                      new profileDB({
                        MemberID: member.id,
                        RealName,
                        Age,
                        AboutMe,
                        Pronounce,
                        Gender,
                      }).save();
                    });
                  break;
                case "Cancel":
                  collected.update({
                    embeds: [
                      embed.setDescription("As you Wish.").setTitle("Ok...."),
                    ],
                    components: [],
                  });
                  break;
              }
            }
          });
        }
        break;
      case "view":
        const MEMBER = options.getMember("member") || member;
        const ProfileData = await profileDB.findOne({ MemberID: MEMBER.id });
        if (!ProfileData)
          return interaction.reply({
            content: `${MEMBER.user.tag} didn't setup an profile yet!`,
            ephemeral: true,
          });
        interaction.reply({
          embeds: [
            embed
              .setAuthor({
                name: `${MEMBER.user.username}'s Profile`,
                iconURL: MEMBER.user.displayAvatarURL(),
              })
              .setThumbnail(MEMBER.user.displayAvatarURL())
              .setTitle(`\`${ProfileData.Pronounce}\` ${ProfileData.RealName}`)
              .setDescription(null)
              .setFields(
                { name: "Age:", value: `${ProfileData.Age}`, inline: true },
                {
                  name: "Gender:",
                  value: `${ProfileData.Gender}`,
                  inline: true,
                },
                { name: "About Me:", value: `${ProfileData.AboutMe}` }
              ),
          ],
        });
        break;
      case "settings":
        switch (options.getString("option")) {
          case "RealName":
            const RealNameInput = new TextInputBuilder()
              .setCustomId(`RealNameInput`)
              .setLabel(`What's your Real Name?`)
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("Capt. Jack Sparrow");
            Modal.addComponents(
              new ActionRowBuilder().addComponents(RealNameInput)
            );
            await interaction.showModal(Modal);
            interaction
              .awaitModalSubmit({ filter, time: 300000 })
              .then(async (i) => {
                if (i.member.id !== member.id) return;
                const RealName = i.fields.getTextInputValue("RealNameInput");
                await profileDB.findOneAndUpdate(
                  { MemberID: member.id },
                  { RealName }
                );
              });
            break;
          case "Age":
            const AgeInput = new TextInputBuilder()
              .setCustomId(`AgeInput`)
              .setLabel(`What's your Age?`)
              .setMinLength(2)
              .setMaxLength(2)
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
              .setPlaceholder(
                "Make sure you only Provide the Number, For example: 18"
              );
            Modal.addComponents(new ActionRowBuilder().addComponents(AgeInput));
            await interaction.showModal(Modal);
            interaction
              .awaitModalSubmit({ filter, time: 300000 })
              .then(async (i) => {
                if (i.member.id !== member.id) return;
                const Age = i.fields.getTextInputValue("AgeInput");
                if (isNaN(Age))
                  return i.reply({
                    content: "Please Provide a Valid Age!",
                    ephemeral: true,
                  });
                await profileDB.findOneAndUpdate(
                  { MemberID: member.id },
                  { Age }
                );
              });
            break;
          case "AboutMe":
            const AboutMeInput = new TextInputBuilder()
              .setCustomId(`AboutMeInput`)
              .setLabel(`Write some lines about your self here!`)
              .setRequired(true)
              .setMinLength(50)
              .setMaxLength(500)
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder(
                "My name is Capt. Jack Sparrow, Where is the Bloody Rum!"
              );
            Modal.addComponents(
              new ActionRowBuilder().addComponents(AboutMeInput)
            );
            await interaction.showModal(Modal);
            interaction
              .awaitModalSubmit({ filter, time: 300000 })
              .then(async (i) => {
                if (i.member.id !== member.id) return;
                const AboutMe = i.fields.getTextInputValue("AboutMeInput");
                new profileDB({
                  MemberID: member.id,
                  AboutMe,
                }).save();
                await profileDB.findOneAndUpdate(
                  { MemberID: member.id },
                  { AboutMe }
                );
              });
            break;
          case "Pronounce":
            const PronounceInput = new TextInputBuilder()
              .setCustomId(`PronounceInput`)
              .setLabel(`How should we call you?`)
              .setMinLength(6)
              .setMaxLength(8)
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("He/Him, She/Her");
            Modal.addComponents(
              new ActionRowBuilder().addComponents(PronounceInput)
            );
            await interaction.showModal(Modal);
            interaction
              .awaitModalSubmit({ filter, time: 300000 })
              .then(async (i) => {
                if (i.member.id !== member.id) return;
                const Pronounce = i.fields.getTextInputValue("PronounceInput");
                if (!["He/Him", "She/Her"].includes(Pronounce))
                  return i.reply({
                    content: "Please Provide an Valid Pronounce!",
                    ephemeral: true,
                  });
                await profileDB.findOneAndUpdate(
                  { MemberID: member.id },
                  { Pronounce }
                );
              });
            break;
          case "Gender":
            const GenderInput = new TextInputBuilder()
              .setCustomId(`GenderInput`)
              .setLabel(`What's your Gender?`)
              .setMinLength(4)
              .setMaxLength(12)
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("Male, Female, Other");
            Modal.addComponents(
              new ActionRowBuilder().addComponents(GenderInput)
            );
            await interaction.showModal(Modal);
            interaction
              .awaitModalSubmit({ filter, time: 300000 })
              .then(async (i) => {
                if (i.member.id !== member.id) return;
                const Gender = i.fields.getTextInputValue("GenderInput");
                if (!["Male", "Female", "Other"].includes(Gender))
                  return i.reply({
                    content: "Please provide an Valid Gender!",
                    ephemeral: true,
                  });
                await profileDB.findOneAndUpdate(
                  { MemberID: member.id },
                  { Gender }
                );
              });
            break;
        }
        interaction.reply({
          content: "Your Profile is Updated!",
          ephemeral: true,
        });
        break;
    }
  },
};
