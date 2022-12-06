const {
  InteractionType,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const setupDB = require("../../src/models/setupDB");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, type, fields, message, guild, channel } = interaction;

    if (type === InteractionType.ModalSubmit) {
      if (["mainRole", "staffRole", "logChannel"].includes(customId)) {
        const msg = await channel.messages.fetch(message.id);
        const data = msg.components[0];
        const newActionRow = ActionRowBuilder.from(data);
        const embed = msg.embeds[0];
        switch (customId) {
          case "mainRole":
            const input1 = fields.getTextInputValue("mainRoleInput");
            if (!guild.roles.cache.has(input1))
              return channel.send({
                content: "The ID was Incorrect, Please Enter an Correct ID!",
              });

            await setupDB.findOneAndUpdate(
              { GuildID: guild.id },
              { mainRoleID: input1 }
            );

            newActionRow.components[0]
              .setDisabled(true)
              .setStyle(ButtonStyle.Success)
              .setEmoji("☑");

            embed.fields[0] = {
              name: "Default Role",
              value: "☑",
              inline: true,
            };

            msg.edit({ embeds: [embed], components: [newActionRow] });
            interaction.reply({
              content: `Default Role Set to <@&${input1}>`,
              ephemeral: true,
            });
            break;
          case "staffRole":
            const input2 = fields.getTextInputValue("staffRoleInput");
            if (!guild.roles.cache.has(input2))
              return interaction.reply({
                content: "The ID was Incorrect, Please Enter an Correct ID!",
                ephemeral: true,
              });

            await setupDB.findOneAndUpdate(
              { GuildID: guild.id },
              { staffRoleID: input2 }
            );

            newActionRow.components[1]
              .setDisabled(true)
              .setStyle(ButtonStyle.Success)
              .setEmoji("☑");

            embed.fields[1] = {
              name: "Staff Role",
              value: "☑",
              inline: true,
            };

            msg.edit({ embeds: [embed], components: [newActionRow] });
            interaction.reply({
              content: `Staff Role Set to <@&${input2}>`,
              ephemeral: true,
            });
            break;
          case "logChannel":
            const input3 = fields.getTextInputValue("logChannelInput");
            if (!guild.channels.cache.has(input3))
              return interaction.reply({
                content: "The ID was Incorrect, Please Enter an Correct ID!",
                ephemeral: true,
              });

            await setupDB.findOneAndUpdate(
              { GuildID: guild.id },
              { logChannelID: input3 }
            );

            newActionRow.components[2]
              .setDisabled(true)
              .setStyle(ButtonStyle.Success)
              .setEmoji("☑");

            embed.fields[2] = {
              name: "Log Channel",
              value: "☑",
              inline: true,
            };

            msg.edit({ embeds: [embed], components: [newActionRow] });
            interaction.reply({
              content: `Log Channel Set to <#${input3}>`,
              ephemeral: true,
            });
            break;
        }
        let setupData = await setupDB.findOne({ GuildID: guild.id });
        if (
          setupData.mainRoleID &&
          setupData.staffRoleID &&
          setupData.logChannelID
        ) {
          msg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor("#800000")
                .setTitle("Setup Complete!")
                .setDescription(
                  `Well done, Now you can use all the commands of the Bot in this Server!
            If you have any Problems feel free to join the [Support Server](https://discord.gg/kF6fqAsHB3).
            `
                )
                .setFooter({
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  text: "Ryou",
                }),
            ],
            components: [],
          });
        }
      }
    }
  },
};
