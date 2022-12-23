const {
  PermissionsBitField,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");
const ecoDB = require("../../src/models/ecoDB");
const setupDB = require("../../src/models/setupDB");
const cooldownDB = require("../../src/models/cooldownDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { commandName, guild, member, channel, options } = interaction;
    const { commands, subCommands, user } = client;
    if (interaction.isChatInputCommand()) {
      // < ==============[Data Imports]============== >
      const collector = channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 15000,
      });
      let setupData = await setupDB.findOne({ GuildID: guild.id });
      let ecoData = await ecoDB.findOne({ MemberID: member.id });
      const embed = new EmbedBuilder()
        .setTitle("Whoopsi")
        .setColor("#800000")
        .setFooter({
          iconURL: user.displayAvatarURL({ dynamic: true }),
          text: "Ryou",
        })
        .setThumbnail(guild.iconURL({ dynamic: true }));
      // < ===========[Initiate InteractionCreate]=========== >
      const cmd = commands.get(commandName);

      if (!cmd)
        return interaction.reply({
          embeds: [
            embed.setDescription(
              "Looks like this Command has Expired, Please try Refreshing your Discord!"
            ),
          ],
          ephemeral: true,
        });
      // < ===========[Developer Only System]=========== >
      if (
        cmd.dev &&
        !["579382548258357419", "564103070334844960"].includes(member.id)
      )
        return interaction.reply({
          embeds: [
            embed.setDescription(
              "This Command is made for Developers Only, Please Refrain from using it!"
            ),
          ],
        });
      // < ==============[Filters]============== >
      if (
        !guild.members.me.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      )
        return interaction.reply({
          embeds: [
            embed.setDescription(
              `It Looks like I don't have Administrator Permissions,
              I need them to be able to completely Handle the Server,
              I would really Appreciate if you could give me the Permissions!`
            ),
          ],
          ephemeral: true,
        });
      if (!member.permissions.has(cmd.userPermissions || []))
        return interaction.reply({
          embeds: [
            embed.setDescription(
              `You don't appear to have permission to use this command,
                If you believe this to be an mistake,
                Please let your administrator know right away!`
            ),
          ],
          ephemeral: true,
        });
      // < ==============[Join Message]============== >
      if (!setupData) {
        const joinEmbed = new EmbedBuilder()
          .setColor("#800000")
          .setTitle("Thank You for Adding Me!")
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .setFooter({
            iconURL: user.displayAvatarURL({ dynamic: true }),
            text: "Ryou",
          });
        interaction.reply({
          embeds: [
            joinEmbed.setDescription(
              `
            Hi I go by **Ryou**.
            I'm at your server to manage it.
              
            To start off, you must set me up.
            Use the command </setup:1008455318881189948> for that!
              
            If this is your second time adding me,
            it's conceivable that I'm already set up,
            but it's ideal if you do it again!
            `
            ),
          ],
        });
        new setupDB({
          GuildID: guild.id,
        }).save();
        return;
      }
      if (!cmd.name.includes("setup")) {
        if (
          setupData.mainRoleID === undefined ||
          setupData.staffRoleID === undefined ||
          setupData.logChannelID === undefined
        )
          return interaction.reply({
            embeds: [
              embed.setDescription(
                `I don't believe you have yet set me up on this server.
              You have to set me up before you can use my commands.
              Use </setup:1008455318881189948> to achieve it!`
              ),
            ],
          });
      }
      //< ==============[ Economy System ]============== >
      if (cmd.category === "Eco" && !ecoData) {
        const Buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("eco-yes")
            .setLabel("Yes")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("✅"),
          new ButtonBuilder()
            .setCustomId("eco-no")
            .setLabel("No")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("❎")
        );
        const M = await interaction.reply({
          embeds: [
            embed.setTitle("Economy Time!").setDescription(
              `Hey, are you curious to try the Economy System?
              If so, here are some fundamentals you should be aware of.
              
              let's look into the fundamentals:
              1. "Yur" is the name of the currency in our economy system.
              2. <:Yur:1034414003071500320> is the symbol for our economy system's currency.
              3. Our economy system also includes the Ruby system.
              4. The Ruby icon for our Economy System is <:Ruby:1034416992813326417>.
              
              Join our [Support Server](https://discord.gg/kF6fqAsHB3) if you have any questions!`
            ),
          ],
          components: [Buttons],
          fetchReply: true,
        });
        collector.on("collect", async (collected) => {
          if (collected.user.id !== member.id) {
            collected.reply({
              embeds: [
                embed.setDescription(
                  "I don't Believe these Buttons are for you, Please Refrain from using it!"
                ),
              ],
              ephemeral: true,
            });
            return;
          }
          if (["eco-no", "eco-yes"].includes(collected.customId)) {
            if (collected.customId == "eco-yes") {
              M.edit({
                embeds: [
                  embed
                    .setTitle("Lets go!")
                    .setDescription(
                      "Alright, Now you can go ahead and use all Economy Commands!"
                    ),
                ],
                components: [],
              });
              new ecoDB({
                MemberID: member.id,
                Cash: 100,
                Bank: 0,
                Banklimit: 100,
                Ruby: 0,
              }).save();
              new invDB({
                MemberID: member.id,
              }).save();
            } else {
              M.edit({
                embeds: [
                  embed
                    .setTitle("I see...")
                    .setDescription(`Looks like you aren't ready for this!`),
                ],
                components: [],
              });
            }
          }
          return;
        });
      }
      // < ===========[Execute Function]=========== >
      async function commandExecute() {
        const subCommand = options.getSubcommand(false);
        if (subCommand) {
          const subCommandFile = subCommands.get(
            `${commandName}.${subCommand}`
          );
          if (!subCommandFile)
            return interaction.reply({
              embeds: [
                embed.setDescription(
                  "Looks like this Command has Expired, Please try Refreshing your Discord!"
                ),
              ],
              ephemeral: true,
            });
          await subCommandFile.execute(interaction, client);
        } else await cmd.execute(interaction, client);
      }
      // < ===========[Cooldown System]=========== >
      if (cmd.cooldown) {
        const currentTime = Date.now();
        const cooldownAmount = cmd.cooldown * 1000;
        const cooldownData = await cooldownDB.findOne({
          MemberID: member.id,
          Cmd: cmd.name,
        });
        if (cooldownData) {
          const expirationTime = cooldownData.Time + cooldownAmount;

          if (currentTime < expirationTime) {
            const timeLeft = (expirationTime - currentTime) / 1000;

            const embed = new EmbedBuilder()
              .setColor("#800000")
              .setTitle(`Whoopsi`)
              .setDescription(
                `Looks like you have to wait a Bit,
                    Before you can use \`${cmd.name}\` again!`
              )
              .setThumbnail(guild.iconURL({ dynamic: true }))
              .setFooter({
                text: "Ryou - Cooldown",
                iconURL: user.displayAvatarURL({ dynamic: true }),
              });
            if (timeLeft.toFixed(1) >= 604800) {
              let week = (timeLeft.toFixed(1) / 604800).toLocaleString();
              if (week.includes(".")) week = week.split(".")[0];
              const word = `Week${week >= "1209600" ? "s" : ""}`;
              embed.setFields({
                name: "Time:",
                value: `${week} ${word}`,
              });
            } else if (timeLeft.toFixed(1) >= 86400) {
              let day = (timeLeft.toFixed(1) / 86400).toLocaleString();
              if (day.includes(".")) day = day.split(".")[0];
              const word = `Day${day >= "172800" ? "s" : ""}`;
              embed.setFields({
                name: "Time:",
                value: `${day} ${word}`,
              });
            } else if (timeLeft.toFixed(1) >= 3600) {
              let hour = (timeLeft.toFixed(1) / 3600).toLocaleString();
              if (hour.includes(".")) hour = hour.split(".")[0];
              const word = `Hour${hour >= "7200" ? "s" : ""}`;
              embed.setFields({
                name: "Time:",
                value: `${hour} ${word}`,
              });
            } else if (timeLeft.toFixed(1) >= 60) {
              let minute = (timeLeft.toFixed(1) / 60).toLocaleString();
              if (minute.includes(".")) minute = minute.split(".")[0];
              const word = `Minute${minute >= "120" ? "s" : ""}`;
              embed.setFields({
                name: "Time:",
                value: `${minute} ${word}`,
              });
            } else {
              let second = timeLeft.toFixed(1).toLocaleString();
              if (second.includes(".")) second = second.split(".")[0];
              embed.setFields({
                name: "Time:",
                value: `${second} Seconds`,
              });
            }
            interaction.reply({ embeds: [embed], ephemeral: true });
          } else {
            await cooldownDB.findOneAndDelete({
              MemberID: member.id,
              Cmd: cmd.name,
            });
            commandExecute();
          }
        } else {
          commandExecute();
          new cooldownDB({
            MemberID: member.id,
            Cmd: cmd.name,
            Time: currentTime,
            Cooldown: cmd.cooldown,
          }).save();
        }
      } else {
        commandExecute();
      }
    }
  },
};
