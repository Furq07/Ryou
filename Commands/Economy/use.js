const {
  ApplicationCommandOptionType,
  TextInputBuilder,
  TextInputStyle,
  ComponentType,
  EmbedBuilder,
  ModalBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const invDB = require("../../src/models/invDB");
const ecoDB = require("../../src/models/ecoDB");
module.exports = {
  name: "use",
  description: "use Items you have in your Inventory",
  options: [
    {
      name: "item",
      description: "Choose what you wanna use.",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "Banknote", value: "Banknote" },
        { name: "Phone", value: "Phone" },
      ],
    },
    {
      name: "quantity",
      description:
        "Enter the amount of item you wanna use, You can also put max to use all of them!",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "member",
      description: "Is Required for some items",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],

  async execute(interaction, client) {
    const { member, options, channel } = interaction;
    const item = options.getString("item");
    const amount = options.getString("quantity") || "1";
    const Target = options.getMember("member");
    const invData = await invDB.findOne({ MemberID: member.id });
    const ecoData = await ecoDB.findOne({ MemberID: member.id });
    const ecoDataM = await ecoDB.findOne({ MemberID: member.id });
    if (isNaN(amount))
      return interaction.reply({ content: "Please enter an valid Integer." });
    if (!invData[item])
      return interaction.reply({
        content: `You don't have any ${item}`,
      });
    if (amount > invData[item])
      return interaction.reply({
        content: `You don't have ${amount}x ${item}`,
      });

    let quantity = amount;
    if (amount.toLowerCase() === "max") quantity = invData[item];
    switch (item) {
      case "Banknote": {
        const randomCash = Math.floor(Math.random() * 1435) + 656;
        const finalCash = randomCash * quantity;
        await ecoDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Banknote: +finalCash } }
        );
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { [item]: -quantity } }
        );
        interaction.reply({
          content: `Successfully Used ${quantity}x 💵 ${item}`,
        });
      }
      case "Phone": {
        const Buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("Emergency")
            .setLabel("Call Emergency")
            .setEmoji("👮")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("Message")
            .setLabel("Message Someone")
            .setEmoji("📤")
            .setStyle(ButtonStyle.Primary)
        );
        const collector = channel.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 60000,
        });
        interaction.reply({
          content: "Please Choose what you wanna do from Below!",
          components: [Buttons],
        });
        collector.on("collect", async (collected) => {
          if (["Emergency", "Message"].includes(collected.customId)) {
            if (collected.member.id !== member.id)
              return collected.reply({
                content: "This Button isn't For you!",
                ephemeral: true,
              });
            switch (collected.customId) {
              case "Emergency":
                if (ecoData.BeingRobbed === true) {
                  await ecoDB.findOneAndUpdate(
                    { MemberID: member.id },
                    { BeingRobbed: false }
                  );
                  collected.update({
                    content:
                      "Alright, we are on our way, we have tracked them down!",
                    components: [],
                  });
                } else {
                  collected.update({
                    content: "Sir, I don't think you are being Robbed.",
                    components: [],
                  });
                }
                break;
              case "Message":
                if (!Target)
                  return interaction.editReply({
                    content:
                      "You need to fill the Member option for this to work!",
                    components: [],
                  });
                if (!ecoDataM || ecoDataM.Phone === null || ecoDataM.Phone <= 0)
                  return interaction.editReply({
                    content: `${Target.user.tag} don't have any phone, what a pigeon gonna send him the message?`,
                  });

                const modal = new ModalBuilder()
                  .setCustomId(`SendMessage`)
                  .setTitle(`Provide Message Here!`);

                const textInput = new TextInputBuilder()
                  .setCustomId(`SendMessageInput`)
                  .setLabel(`Input Message Here:`)
                  .setRequired(true)
                  .setStyle(TextInputStyle.Short)
                  .setPlaceholder("Hey, How's Going!");
                modal.addComponents(
                  new ActionRowBuilder().addComponents(textInput)
                );
                await collected.showModal(modal);
                const filter = (interaction) =>
                  interaction.customId === "SendMessage";
                interaction
                  .awaitModalSubmit({ filter, time: 15_000 })
                  .then((interaction) => {
                    const msg =
                      interaction.fields.getTextInputValue("SendMessageInput");
                    Target.send({
                      embeds: [
                        new EmbedBuilder()
                          .setTitle("Message from Someone!")
                          .setColor("#800000")
                          .setFields(
                            {
                              name: `From:`,
                              value: `${member.user.username}`,
                            },
                            { name: "Message:", value: `${msg}` }
                          ),
                      ],
                    });
                    interaction.update({
                      content: "Message have been Send!",
                      components: [],
                    });
                  })
                  .catch(console.error);
                break;
            }
          }
        });
        collector.on("end", async () => {
          interaction.editReply({
            content: "This Command has Expired.",
            components: [],
          });
        });
      }
    }
  },
};
