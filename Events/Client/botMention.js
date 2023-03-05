// [-------------------[Imports]-------------------]
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
// [-------------------[File Initiation]-------------------]
module.exports = {
  name: "messageCreate",
  execute(message, client) {
    const { author, content, guild, channel } = message;
    const { user } = client;
    // [-------------------[Bot Mention Function]-------------------]
    const collector = channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 300000,
    });
    if (author.bot) return;
    if (content.includes("<@1006852642498162708>")) {
      const Buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("mentionCmdList")
          .setLabel("Command List")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("💻"),
        new ButtonBuilder()
          .setLabel("Support Server!")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/Eqb9dEQXYa")
          .setEmoji("💁‍♂️")
      );
      const embed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("Do you need Something?")
        .setDescription(
          `
        **${author} I wonder why you Mentioned me?**

        Click on the Command Button to see a list of commands.
        Would you want to join our support server, perhaps? then click the Support Server button!
        `
        )
        .setFooter({
          iconURL: user.displayAvatarURL({ dynamic: true }),
          text: "Ryou",
        })
        .setThumbnail(guild.iconURL({ dynamic: true }));
      message.reply({ embeds: [embed], components: [Buttons] });

      collector.on("collect", async (collected) => {
        if (collected.user.id !== author.id) {
          collected.reply({
            content: `These Buttons aren't for You!`,
            ephemeral: true,
          });
          return;
        }
        if (["mentionCmdList"].includes(collected.customId)) {
          collected.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Commands Huh?")
                .setColor("DarkRed")
                .setDescription(
                  `Try Using </help:1009089587026591806>,
                  Did you Expect me to Send an list of Commands Here 🤔
                  Ye... Not Gonna Happen, My Author is Too Lazy to Write an Whole list of commands *Again*`
                )
                .setFooter({
                  iconURL: user.displayAvatarURL({ dynamic: true }),
                  text: "Ryou",
                })
                .setThumbnail(guild.iconURL({ dynamic: true })),
            ],
            ephemeral: true,
          });
        }
      });
    }
  },
};
