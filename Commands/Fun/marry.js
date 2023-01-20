 const {EmbedBuilder, ApplicationCommandOptionType} = require('discord.js');
 module.exports = {
    name: 'marry',
    description: 'Marry someone',
    options: [
        {
            name : 'partner',
            description: 'Who is going to be your partner?',
            required: true,
            type: ApplicationCommandOptionType.User
        }
    ],
    async execute(interaction, client) {
        
    }
 }