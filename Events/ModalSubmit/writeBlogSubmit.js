const invDB = require("../../src/models/invDB");
const ecoDB = require("../../src/models/ecoDB");
const { InteractionType, EmbedBuilder } = require("discord.js");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { member, customId, type, channel, message, guild, fields } =
      interaction;
    if (type == InteractionType.ModalSubmit && customId === "writeBlog") {
      const input = fields.getTextInputValue("writeBlogInput");
      const msg = await channel.messages.fetch(message.id);
      const embed = new EmbedBuilder()
        .setTitle("WorkPlace")
        .setColor("#800000")
        .setFooter({
          text: "Ryou - Economy",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail(guild.iconURL({ dynamic: true }));
      const random = Math.floor(Math.random() * 100) + 1;
      if (random <= 25) {
        msg.edit({
          embeds: [
            embed
              .setTitle(`${member.user.username}'s Blogging Page`)
              .setDescription(
                `Everyone **Hated** your Blog, so they send an **Virus** on your PC, now its **Broken** for Life!
            
              **Your Blog:**
              ${input}`
              ),
          ],
          components: [],
        });
        interaction.reply({ content: "Posted!", ephemeral: true });
        await invDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Laptop: -1 } }
        );
      } else if (random >= 26 && random <= 75) {
        const randomNumber = Math.floor(Math.random() * 1295) + 93;
        await ecoDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { Cash: +randomNumber } }
        );
        msg.edit({
          embeds: [
            embed
              .setTitle(`${member.user.username}'s Blogging Page`)
              .setDescription(
                `Your Blog was just ***Meh***, you earned an Decent amount <:Yur:1034414003071500320>\`${randomNumber}\`
             
              **Your Blog:**
              ${input}`
              ),
          ],
          components: [],
        });
        interaction.reply({ content: "Posted!", ephemeral: true });
      } else if (random >= 76) {
        const randomNumber = Math.floor(Math.random() * 3657) + 1654;
        await ecoDB.findOneAndUpdate(
          { MemberID: member.id },
          { $inc: { coins: +randomNumber } }
        );
        msg.edit({
          embeds: [
            embed
              .setTitle(`${member.user.username}'s Blogging Page`)
              .setDescription(
                `**Hey Nice,** Your Blog went **Viral**! You made heck of a **Yur**. <:Yur:1034414003071500320>\`${randomNumber}\` to be Exact!
             
              **Your Blog:**
              ${input}`
              ),
          ],
          components: [],
        });
        interaction.reply({ content: "Posted!", ephemeral: true });
      }
    }
  },
};
