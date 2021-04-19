const logger = require('../../log.js');

module.exports = {
    name: 'kick',
    aliases: ['expulsar', 'chutar'],
    args: true,
    usage: '[usuario] -m [mensagem] (ex: -kick @Heimdallr -m \'zuando o role\')',
    log: true,
    type: ['Admin', 'admin'],
    cooldown: 5,
	description: 'Expulsar usuário',
	execute(message, command_name, args) {
        // Check user permission to execute the command
        if (message.member.roles.highest.permissions.has('KICK_MEMBERS')) {
            if (!message.mentions.users.size) {
                return message.reply('você precisa mencionar um usário para expulsar!');
            }

            const mention_user = message.mentions.members.first();

            // Check if flag '-m' and message is in arguments
            if (message.content.search(/-m/g) != -1) {
                return message.reply('você não adicionou um motivo do expulso!');
            } 

            const description = message.content.match(/-m \"([^']+)\"/g)

            if (!description) {
                return message.reply('você precisa adicionar uma mensagem de expulsão!');
            }
        
            // Try to kick the mentioned user
            const now = new Date();
            try {
                message.channel.send(`Usuário ${mention_user.tag} expulso!`);
                mention_user.kick();
            } catch (error) {
                console.error(`${now.toLocaleString("pt-BR")}: kick :${error}`);
                return message.channel.send('Houve um erro ao tentar expulsar o usuário!');
            }
        } else {
            return message.reply('você não possui permissão para executar esse comando!');
        }
	},
};
