const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
  name: "horoscope",
  description: "Find your horoscope based on your Zodiac sign",
  options: [
    {
      name: "zodiacsign",
      description: "Enter your Zodiac sign",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  async execute(interaction, client) {
    const Zodiac = interaction.options.getString("zodiacsign");
    const zodiacSigns = [
      {
        name: "aries",
        horoscope:
          "As an Aries, you are energetic, confident, and courageous. You are known for your determination and leadership skills, and you often take charge in situations. You are quick to act and enjoy a good challenge. This month, focus on finding a balance between your bold nature and the needs of those around you. Remember to listen to others and consider their perspectives before making a decision.",
      },
      {
        name: "taurus",
        horoscope:
          "As a Taurus, you are practical, reliable, and determined. You value stability and security, and you have a strong work ethic. This month, focus on staying true to your values and being persistent in the face of challenges. Remember to take care of yourself and prioritize your own needs as well. Trust in your own abilities and don't be afraid to seek out new opportunities.",
      },
      {
        name: "gemini",
        horoscope:
          "As a Gemini, you are intelligent, adaptable, and curious. You enjoy learning new things and are known for your quick wit and versatility. This month, focus on using your communication skills to connect with others and build strong relationships. Remember to stay open-minded and embrace change, as it can bring new opportunities and experiences your way.",
      },
      {
        name: "cancer",
        horoscope:
          "As a Cancer, you are intuitive, emotional, and nurturing. You are known for your caring nature and your ability to provide emotional support to those around you. This month, focus on taking care of yourself and setting healthy boundaries. Remember to trust your instincts and don't be afraid to express your feelings. Lean on your loved ones for support when you need it.",
      },
      {
        name: "leo",
        horoscope:
          "As a Leo, you are confident, generous, and warm-hearted. You are known for your leadership skills and your ability to inspire others. This month, focus on using your natural charisma and creativity to make a positive impact in your personal and professional life. Remember to be gracious and thankful for the support of those around you.",
      },
      {
        name: "virgo",
        horoscope:
          "As a Virgo, you are analytical, practical, and perfectionist. You are known for your attention to detail and your ability to solve problems. This month, focus on using your skills to create structure and organization in your life. Remember to be patient and to take care of your physical and emotional well-being. Don't be afraid to ask for help when you need it.",
      },
      {
        name: "libra",
        horoscope:
          "As a Libra, you are diplomatic, fair-minded, and sociable. You are known for your ability to bring balance and harmony to situations. This month, focus on finding ways to bring positivity and joy to your personal and professional life. Remember to listen to others and be open to compromise in order to find win-win solutions.",
      },
      {
        name: "scorpio",
        horoscope:
          "As a Scorpio, you are passionate, resourceful, and intense. You are known for your determination and your ability to overcome challenges. This month, focus on harnessing your determination and perseverance to achieve your goals. Remember to take time for self-care and to nurture your relationships with loved ones. Don't be afraid",
      },
      {
        name: "sagittarius",
        horoscope:
          "As a Sagittarius, you are adventurous, optimistic, and philosophical. You are known for your wanderlust and your ability to see the bigger picture. This month, focus on setting and pursuing your goals, both short-term and long-term. Remember to stay true to your values and be open to new experiences and perspectives. Don't be afraid to take risks and embrace change.",
      },
      {
        name: "capricorn",
        horoscope:
          "As a Capricorn, you are ambitious, disciplined, and practical. You are known for your hard work and your ability to achieve success. This month, focus on setting clear goals and working towards them with determination. Remember to take care of yourself and prioritize your well-being. Don't be afraid to ask for help or support when you need it.",
      },
      {
        name: "aquarius",
        horoscope:
          "As an Aquarius, you are independent, original, and humanitarian. You are known for your innovative ideas and your desire to make a positive impact on the world. This month, focus on using your unique perspective and creativity to bring about positive change. Remember to stay true to your values and to be open to new ideas and ways of thinking. Don't be afraid to be yourself and to stand up for what you believe in.",
      },
      {
        name: "pisces",
        horoscope:
          "As a Pisces, you are intuitive, sensitive, and artistic. You are known for your creativity and your ability to see things from a different perspective. This month, focus on using your creativity and intuition to find new solutions and ideas. Remember to take care of yourself and to set healthy boundaries. Don't be afraid to follow your dreams and to express yourself authentically.",
      },
    ];
    const validZodiacSign = zodiacSigns.find(
      (sign) => sign.name === Zodiac.toLowerCase()
    );
    if (!validZodiacSign) {
      return interaction.reply({
        content: `Invalid Zodiac sign: \`${Zodiac}\`, try again with valid Zodiac sign (make sure all letters are small)`,
        ephemeral: true,
      });
    }

    zodiacSigns.forEach((sign) => {
      if (sign.name === Zodiac.toLowerCase()) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#800000")
              .setTitle("Horoscope finder")
              .setDescription(
                `**Zodiac**: ${
                  sign.name.charAt(0).toUpperCase() + sign.name.slice(1)
                }\n**Horoscope**: \n${sign.horoscope}`
              )
              .setFooter({
                text: "Ryou - Fun",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              }),
          ],
        });
      }
    });
  },
};
