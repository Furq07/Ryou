const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const Canvas = require("canvas");
const { draw } = require("../../Commands/Fun/whisper");
module.exports = {
  name: "slap",
  description: "Slap someone",
  options: [
    {
      name: "user",
      description: "Enter the user whom you want to slap",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async execute(interaction, client) {
    const user = interaction.options.getMember("user");
    const canvas = Canvas.createCanvas(900, 900);
    const context = canvas.getContext("2d");
    const images = [
      "src/images/slap.jpg",
      "src/images/slap2.png",
      "src/images/slap3.png",
      "src/images/slap4.png",
    ];

    const userImage = await Canvas.loadImage(
      user.user.displayAvatarURL({ extension: "png" })
    );
    const slapperImage = await Canvas.loadImage(
      interaction.user.displayAvatarURL({ extension: "png" })
    );
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const image = await Canvas.loadImage(randomImage);
    switch (randomImage) {
      case "src/images/slap.jpg":
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.save();
        context.rotate((-6.5 * Math.PI) / 180);
        context.drawImage(slapperImage, 20, 270, 250, 270);
        context.restore();
        context.save();
        context.rotate((-6 * Math.PI) / 180);
        context.drawImage(userImage, 340, 370, 350, 400);
        context.restore();
        break;
      case "src/images/slap2.png":
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.drawImage(slapperImage, 560, 160, 250, 320);
        context.drawImage(userImage, 200, 100, 300, 400);
        break;
      case "src/images/slap3.png":
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.drawImage(slapperImage, 470, 200, 200, 200);
        context.save();
        context.rotate((-3 * Math.PI) / 180);
        context.drawImage(userImage, 0, 100, 400, 600);
        context.restore();
        break;
      case "src/images/slap3.png":
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        context.drawImage(slapperImage, 620, 180, 150, 200);
        context.drawImage(userImage, 350, 60, 220, 300);
        break;
    }

    const attachment = new AttachmentBuilder(canvas.toBuffer(), "slap.jpg");
    interaction.channel.send({ files: [attachment] });
  },
};
