const logger = require('../../log.js');

module.exports = {
    name: 'off',
    aliases: ['desligar'],
    log: true,
    type: ['Admin', 'admin'],
    cooldown: 0,
	description: 'Desligar bot',
	execute(message, commandName, args) {
        // Check user permission to execute the command
        if (message.author.id === '304796522279862274') {            
            // Try to finish the bot proccess
            const now = new Date();
            try {
                console.log(`${now.toLocaleString("pt-BR")}: Desligando...`);
                setTimeout(() => { process.exit() }, 3000);                
            } catch (error) {
                console.error(`${now.toLocaleString("pt-BR")}: off :${error}`);
                return message.channel.send('Houve um erro ao tentar desligar o bot!');
            }
        } else {
            return message.reply('você não possui permissão para executar esse comando!');
        }
	},
};
