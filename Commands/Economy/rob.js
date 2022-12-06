const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const wait = require("util").promisify(setTimeout);
const ecoDB = require("../../src/models/ecoDB");
module.exports = {
  name: "rob",
  description: "Rob someone 😈",
  cooldown: 3600,
  category: "Eco",
  options: [
    {
      name: "target",
      description: "The user you wanna rob.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "partner",
      description:
        "Who is your partner in this robbery? (i mean you can't rob a person alone duh)",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async execute(interaction, client) {
    const { member, guild, options, channel } = interaction;
    const target = options.getMember("target");
    const partner = options.getMember("partner");
    const ecoData = await ecoDB.findOne({ MemberID: member.id });
    const ecoDataT = await ecoDB.findOne({ MemberID: target.id });
    const ecoDataP = await ecoDB.findOne({ MemberID: partner.id });
    const embed = new EmbedBuilder()
      .setColor("#800000")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: "Ryou - Economy",
      });
    if (partner.id === client.user.id)
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Wait what?")
            .setDescription(
              "You want me to be your Partner? ayo that's cheating."
            ),
        ],
      });
    if (target.id === client.user.id)
      return interaction.reply({
        embeds: [
          embed.setTitle("Bruh...").setDescription(
            `Imagine trying Rob the one who controls the Economy 💀

              I can literally wipe your whole data dude.`
          ),
        ],
      });
    if (!ecoDataT)
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Whoopsi")
            .setDescription(
              `I don't think your target(${target}) ever even used Economy!`
            ),
        ],
      });
    if (!ecoDataP)
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Whoopsi")
            .setDescription(
              `I don't think your partner(${partner}) ever even used Economy!`
            ),
        ],
      });
    if (partner === member)
      return interaction.reply({
        embeds: [
          embed.setTitle("Wait what?")
            .setDescription(`Ok so, your partner is yourself?

            *my man here thinks he is 1 man army...*`),
        ],
      });

    if (target === member)
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Wait what?")
            .setDescription(
              `Ok so, you are trying to rob ${target}, don't you think that's you?`
            ),
        ],
      });
    if (target === partner)
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Wait what?")
            .setDescription(
              `Ok so, you are trying to rob ${target}, don't you think that's your partner?`
            ),
        ],
      });
    if (ecoDataT.Cash < 200)
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Whoopsi")
            .setDescription("My Dude's Broke af, what you gonna rob from him."),
        ],
      });
    const Buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("Accept")
        .setStyle(ButtonStyle.Success)
        .setLabel("Accept"),
      new ButtonBuilder()
        .setCustomId("Deny")
        .setStyle(ButtonStyle.Danger)
        .setLabel("Deny")
    );
    const M = await interaction.reply({
      content: `${partner}`,
      embeds: [
        embed.setTitle(`Robbery Partner Request!`).setDescription(
          `Hey ${partner}, ${member} wants you to be his Robbery Partner while Robbing ${target}
            
            If you accept then click on the Accept Button otherwise click on Deny!`
        ),
      ],
      components: [Buttons],
      fetchReply: true,
    });
    partner
      .send({
        embeds: [
          embed.setDescription(
            `Hey, someone have requested you to be there Robbery Partner!
        
        [Click Here](${M.url}) to go there!`
          ),
        ],
      })
      .catch((err) => {
        return;
      });

    const collector = await channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 300000,
    });
    collector.on("collect", async (collected) => {
      if (["Accept", "Deny"].includes(collected.customId)) {
        if (collected.member.id !== partner.id)
          return collected.reply({
            content: "This button isn't for you!",
            ephemeral: true,
          });
        if (["Accept"].includes(collected.customId)) {
          await ecoDB.findOneAndUpdate(
            { MemberID: target.id },
            { BeingRobbed: true }
          );
          collected.update({
            content: "",
            embeds: [
              embed.setTitle("Request Accepted!").setDescription(
                `Looks like ${partner} Accepted it!
              Lets start the Robbery, shall we!`
              ),
            ],
            components: [],
          });
          await wait(3000);
          for (let i = 30; i > 0; i--) {
            await wait(1000);
            interaction.editReply({
              embeds: [
                embed
                  .setTitle("Starting Robbery...")
                  .setDescription(
                    `Getting things ready to Rob, starting Robbery in ${i} Seconds.`
                  ),
              ],
            });
          }
          const Check = await ecoDB.findOne({ MemberID: target.id });
          if (Check.BeingRobbed !== true) {
            const percentageF = [10, 20, 30, 5, 35, 8, 15, 25];
            const resultF = Math.floor(Math.random() * percentageF.length);
            const final = (percentageF[resultF] * ecoDataT.Cash) / 100;
            const Fine = parseInt(final);
            const HalfFine = parseInt(Fine / 2);
            await ecoDB.findOneAndUpdate(
              { MemberID: target.id },
              { $inc: { Cash: +Fine } }
            );
            await ecoDB.findOneAndUpdate(
              { MemberID: member.id },
              { $inc: { Cash: -HalfFine } }
            );
            await ecoDB.findOneAndUpdate(
              { MemberID: partner.id },
              { $inc: { Cash: -HalfFine } }
            );
            interaction.editReply({
              embeds: [
                embed
                  .setTitle("Whoooooooo, Police is Here!")
                  .setDescription(
                    `Looks like Target have called Police on you both!
                Well, time for you both to get some fine :)`
                  )
                  .setFields(
                    {
                      name: "Money Fined:",
                      value: `${client.config.ecoIcon}${Fine}`,
                      inline: true,
                    },
                    { name: "Fine Gave To:", value: `${target}`, inline: true },
                    {
                      name: `${member.user.username} Gave:`,
                      value: `${client.config.ecoIcon}${HalfFine}`,
                      inline: true,
                    },
                    {
                      name: `${partner.user.username} Gave:`,
                      value: `${client.config.ecoIcon}${HalfFine}`,
                      inline: true,
                    }
                  ),
              ],
            });
            return;
          }
          // Percentage Maker
          const percentage = [
            10, 20, 50, 70, 80, 90, 0, 5, 8, 1, 2, 3, 0, 0, 0,
          ];
          const result = Math.floor(Math.random() * percentage.length);
          const final = (percentage[result] * ecoDataT.Cash) / 100;
          const Robbed = parseInt(final);
          const HalfRobbed = parseInt(Robbed / 2);
          // Robbery Failed
          if (percentage[result] == 0) {
            const percentageF = [10, 20, 30, 5, 35, 8, 15, 25];
            const resultF = Math.floor(Math.random() * percentageF.length);
            const final = (percentageF[resultF] * ecoDataT.Cash) / 100;
            const Fine = parseInt(final);
            const HalfFine = parseInt(Fine / 2);
            await ecoDB.findOneAndUpdate(
              { MemberID: target.id },
              { $inc: { Cash: +Fine } }
            );
            await ecoDB.findOneAndUpdate(
              { MemberID: member.id },
              { $inc: { Cash: -HalfFine } }
            );
            await ecoDB.findOneAndUpdate(
              { MemberID: partner.id },
              { $inc: { Cash: -HalfFine } }
            );
            interaction.editReply({
              embeds: [
                embed
                  .setTitle("Robbery Failed!")
                  .setDescription("You both got caught and had to pay fine.")
                  .setFields(
                    {
                      name: "Money Fined:",
                      value: `${client.config.ecoIcon}${Fine}`,
                      inline: true,
                    },
                    { name: "Fine Gave To:", value: `${target}`, inline: true },
                    {
                      name: `${member.user.username} Gave:`,
                      value: `${client.config.ecoIcon}${HalfFine}`,
                      inline: true,
                    },
                    {
                      name: `${partner.user.username} Gave:`,
                      value: `${client.config.ecoIcon}${HalfFine}`,
                      inline: true,
                    }
                  ),
              ],
            });
            return;
          }
          //Robbery Successful
          if (percentage[result] == 90 || percentage[result] == 80) {
            embed.setDescription(
              `Damn, You Both took Almost Everything from ${target}`
            );
          } else if (percentage[result] == 50) {
            embed.setDescription(
              `Whooho, You Both Took Half of ${target}'s Life Savings.`
            );
          } else if (percentage[result] == 70) {
            embed.setDescription(
              `Ayo, You Both Took More than Half of ${target}'s Savings.`
            );
          } else {
            embed.setDescription("You both took atleast something!");
          }
          await ecoDB.findOneAndUpdate(
            { MemberID: target.id },
            { $inc: { Cash: -Robbed } }
          );
          await ecoDB.findOneAndUpdate(
            { MemberID: member.id },
            { $inc: { Cash: +HalfRobbed } }
          );
          await ecoDB.findOneAndUpdate(
            { MemberID: partner.id },
            { $inc: { Cash: +HalfRobbed } }
          );
          interaction.editReply({
            embeds: [
              embed.setTitle("Robbery Successful!").setFields(
                {
                  name: "Money Robbed:",
                  value: `${client.config.ecoIcon}${Robbed}`,
                  inline: true,
                },
                { name: "Robbed From:", value: `${target}`, inline: true },
                {
                  name: `${member.user.username} Got:`,
                  value: `${client.config.ecoIcon}${HalfRobbed}`,
                  inline: true,
                },
                {
                  name: `${partner.user.username} Got:`,
                  value: `${client.config.ecoIcon}${HalfRobbed}`,
                  inline: true,
                }
              ),
            ],
          });
          await ecoDB.findOne({ MemberID: target.id }, { BeingRobbed: false });
        } else if (["Deny"].includes(collected.customId)) {
          collected.update({
            content: "",
            embeds: [
              embed.setTitle("Request Denied!").setDescription(
                `Looks like ${partner} Denied it!,
              Maybe you need an partner that actually wanna rob someone!`
              ),
            ],
            components: [],
          });
        }
      }
    });
    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        interaction.editReply({
          content: "",
          embeds: [
            embed
              .setTitle("Request Denied!")
              .setDescription(
                `Looks like ${partner} Don't wanna rob ${target}.`
              ),
          ],
          components: [],
        });
      }
    });
  },
};
