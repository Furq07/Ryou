const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const Canvas = require("canvas");
module.exports = {
  name: "whisper",
  description: "Whisper in someone's ear",
  options: [
    {
      name: "message",
      description: "Enter the message what you want to whisper",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "listener",
      description: "Who is going to be the listener?",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async execute(interaction, client) {
    const listener = interaction.options.getMember("listener");
    const message = interaction.options.getString("message");
    const canvas = Canvas.createCanvas(1200, 700);
    const context = canvas.getContext("2d");

    const overlay = await Canvas.loadImage("src/images/overlay.png");
    const image = await Canvas.loadImage("src/images/whisper.jpg");

    const listenerAvatar = await Canvas.loadImage(
      listener.user.displayAvatarURL({ extension: "png" })
    );
    const whispererAvatar = await Canvas.loadImage(
      interaction.user.displayAvatarURL({ extension: "png" })
    );

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.drawImage(listenerAvatar, 660, 160, 430, 430);
    context.drawImage(whispererAvatar, 140, 110, 400, 400);
    context.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    context.font = "bold 45px Arial";
    context.fillStyle = "#FFFFFF";
    let words = message.split(" ");
    let text = words.join(" ") + "".replace(/,/g, " ");
    let width = context.measureText(text).width;
    function drawStroked(text, x, y) {
      context.font = "bold 45px Arial";
      context.strokeStyle = "black";
      context.lineWidth = 6;
      context.strokeText(text, x, y);
      context.fillStyle = "white";
      context.fillText(text, x, y);
    }
    if (width <= 120) drawStroked(`${text}`, 500, 670);
    else if (width > 120 && width <= 250) drawStroked(`${text}`, 488, 670);
    else if (width > 250 && width <= 450) drawStroked(`${text}`, 390, 670);
    else if (width > 450 && width <= 500) drawStroked(`${text}`, 345, 670);
    else if (width > 500 && width <= 650) drawStroked(`${text}`, 330, 670);
    else if (width > 650 && width <= 750) drawStroked(`${text}`, 230, 670);
    else if (width > 750 && width <= 850) drawStroked(`${text}`, 190, 670);
    else {
      interaction.reply({
        content: "Your message is too big, make it small",
        ephemeral: true,
      });
      return;
    }

    const attachment = new AttachmentBuilder(canvas.toBuffer(), "whisper.png");
    await interaction.channel.send({ files: [attachment] });
  },
};
