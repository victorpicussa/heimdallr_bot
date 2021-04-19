const logger = require('../../log.js');

module.exports = {
    name: 'ban',
    aliases: ['banir'],
    args: true,
    usage: '[usuario] -m [mensagem] (ex: -ban @Heimdallr -m \'zuando o role\')',
    log: true,
    type: ['Admin', 'admin'],
    cooldown: 5,
	description: 'Banir usuário',
	execute(message, command_name, args) {
        // Check user permission to execute the command
        if (message.member.roles.highest.permissions.has('BAN_MEMBERS')) {
            if (!message.mentions.users.size) {
                return message.reply('você precisa mencionar um usário para banir!');
            }

            const mention_user = message.mentions.users.first();

            // Check if flag '-m' and message is in arguments
            if (!message.content.search(/-m/g) != -1) {
                return message.reply('você não adicionou um motivo do ban!');
            } 

            const description = message.content.match(/-m \"([^']+)\"/g)

            if (!description) {
                return message.reply('você precisa adicionar uma mensagem de ban!');
            }
        
            // Try to kick the mentioned user
            const now = new Date();
            try {
                message.channel.send(`Usuário ${mention_user.tag} banido!`);
                message.guild.members.ban(mention_user);
            } catch (error) {
                console.error(`${now.toLocaleString("pt-BR")}: ban :${error}`);
                return message.channel.send('Houve um erro ao tentar banir o usuário!');
            }
        } else {
            return message.reply('você não possui permissão para executar esse comando!');
        }
	},
};
