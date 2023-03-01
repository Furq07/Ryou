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
      listener.user.displayAvatarURL({ extension: "jpg" })
    );
    const whispererAvatar = await Canvas.loadImage(
      interaction.user.displayAvatarURL({ extension: "jpg" })
    );
    await interaction.deferReply({ ephemeral: false });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.save();
    context.rotate((10 * Math.PI) / 180);
    context.drawImage(listenerAvatar, 700, 0, 450, 450);
    context.restore();
    context.save();
    context.rotate((6 * Math.PI) / 180);
    context.drawImage(whispererAvatar, 135, 80, 480, 480);
    context.restore();

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

    const attachment = new AttachmentBuilder(
      canvas.toBuffer(),
      "whisper-image.png"
    );
    await interaction.editReply({ files: [attachment] });
  },
};
