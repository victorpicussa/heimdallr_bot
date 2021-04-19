module.exports = {
    name: 'prune2',
    aliases: ['excluir2', 'delete2', 'deletar2'],
    args: true,
    log: true,
    usage: '[mensagens] (ex: -prune2 10)',
    type: ['Admin', 'admin'],
    cooldown: 4,
	description: 'Deletar mensagens feitas há mais de 2 semanas',
	execute(message, command_name, args) {    
        // Check user permission to execute the command
        if (message.member.roles.highest.permissions.has('MANAGE_MESSAGES')) {
            let channel = '',
                channel_name = '',
                amount = parseInt(args[0]) + 1;

            // Check if flag '-c' for channel is in arguments
            if (message.content.search(/-c/g) != -1) {
                channel_name = message.content.match(/-c \"([^']+)\"/g).join('').substring(3).replace(/\"+/g, '');

                let re = new RegExp(channel_name, 'g');
                channel = message.guild.channels.cache.find(channel => channel.name.match(re));

                if (!channel) {
                    return message.channel.send('Canal não encontrado!');
                } else if (!message.content.search("-i")) {
                    return message.channel.send('Parâmetro de quantide(-i) não encontrado!');
                }
                amount = message.content.match(/-i ([^']+)/g).join('').substring(3);
                amount = parseInt(amount) + 1;
            }

            if (isNaN(amount)) {
                return message.reply('o valor digitado não é válido.');
            }  else if (amount <= 1 || amount > 100) {
                return message.reply('você precisa adicionar um valor entre 1 e 99.');
            }
            
            const now = new Date();
            // Fetch and delete message by message
            if (!channel) {
                message.channel.messages.fetch({ limit: amount }).then(messages => {
                    messages.forEach(msg => {
                        msg.delete();
                    });                
                }).catch(err => {
                    console.error(`${now.toLocaleString("pt-BR")}: prune2 :${err}`);
                    message.channel.send('Houve um erro ao tentar deletar mensagens nesse canal!');
                });
            } else {
                channel.messages.fetch({ limit: amount }).then(messages => {
                    messages.forEach(msg => {
                        msg.delete();
                    });                
                }).catch(err => {
                    console.error(`${now.toLocaleString("pt-BR")}: prune2 :${err}`);
                    message.channel.send(`Houve um erro ao tentar deletar mensagens do canal ${channel_name}!`);
                });
            }
        } else {
            return message.reply('você não possui permissão para executar esse comando!');
        }
    },
};
