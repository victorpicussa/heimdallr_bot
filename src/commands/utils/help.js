const { prefix } = require('../../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['ajuda', 'info', 'comandos', 'commands', 'cmd'],
	description: 'Listar todos os comandos',
    usage: ' OU -help [commando] (ex: -help server)',
    log: false,
    type: ['Utilitarios', 'utils'],
	cooldown: 3,
	execute(message, command_name, args) {
        const { commands } = message.client;
        
        const data = new Discord.MessageEmbed()
            .setColor('#ebd93b')
            .setTitle('Comando Ajuda')
            .setAuthor('Heimdallr', 'https://i.imgur.com/Q2NEHdV.jpg', 'https://norse-mythology.org/gods-and-creatures/the-aesir-gods-and-goddesses/heimdall/')
            .setThumbnail('https://i.imgur.com/Q2NEHdV.jpg')
            .setTimestamp()
            .setFooter('\"Heimdallr irá soprar Gjallerhorn uma única vez, no final de todas as coisas, Ragnarok.\"', false);        
        
        // Check if command has arguments, if not, return help for all commands
        if (!args.length) {
            let all_cmd = {};
            
            commands.map(command => {
                if (!all_cmd[command.type[0]]) {
                    all_cmd[command.type[0]] = [];
                }
                all_cmd[command.type[0]].push(command.name)
            });
            
            data.setDescription('Lista de todos os comandos:');
            for (const [type, cmds] of Object.entries(all_cmd)) {
                data.addField(`**${type}**`, cmds.join(', '), true );
            }
            
            if (message.channel.type === 'dm') {
                return message.author.send(data)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('Enviei uma mensagem privada com os comandos!');
                })
                .catch(error => {
                    console.error(`Problema em enviar mensagem privada para ${message.author.tag}.\n`, error);
                    message.reply('Não consegui te enviar uma mensagem privada! Suas mensagens privadas estão desabilitadas?');
                });
            } else {
                message.channel.send(data);

                message.delete().catch(err => {
                    console.error(`${now.toLocaleString("pt-BR")}:${err}`);
                    message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
                });

                return;
            }
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        
        if (!command) {
            return;
        }
        // Return help of a specific command
        data.setDescription('O comando possui as seguintes configurações:')

        data.addField(`**Comando**`, command.name, true);

        if (command.aliases) data.addField(`**Nomes**`, command.aliases.join(', '), true);
        if (command.description) data.addField(`**Descrição**`, command.description, true );
        if (command.usage) data.addField(`**Uso**`, prefix + command.name + " " + command.usage, true );

        data.addField(`**Cooldown** `, (command.cooldown || 3) + ` segundo(s)`, true);

        message.channel.send(data);

        message.delete().catch(err => {
            console.error(`${now.toLocaleString("pt-BR")}:${err}`);
            message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
        });
	},
};