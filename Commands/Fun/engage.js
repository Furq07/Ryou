const {EmbedBuilder, ApplicationCommandOptionType} = require('discord.js');
module.exports ={
    name: 'engage',
    description: 'Engage your love',
    options: [
        {
            name: 'partner',
            description: 'Enter your partner whom you are going to get engaged',
            required: true,
            type: ApplicationCommandOptionType.User
        }
    ],
    async execute(interacion, client){
        
    }
}