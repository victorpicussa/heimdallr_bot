const Discord = require('discord.js');

module.exports = {
    name: 'team',
    aliases: ['tm', 'time'],
    args: false,
    usage: '-n [usuarios] (ex: -tm -n 5)',
    type: ['Utilitarios', 'utils'],
    cooldown: 3,
	description: 'Cria um time a partir de uma sala de voz',
	execute(message, command_name, args) {        
        const voice_channel = message.member.voice.channel;        
        let number_param = args.indexOf('-n');

		if (!voice_channel) {
            return message.reply('você não está em um canal de voz para usar esse comando!');
        }
        
        // Check if the argument is a valid number
        if (number_param < 0) {
            return message.reply('você deve adicionar uma quantidade de pessoas com -n!');
        } else if (!args[number_param+1] || isNaN(args[number_param+1]) || parseInt(args[number_param+1]) < 1) {
            return message.reply('tamanho do time inválido!');
        }
        
        number_param = parseInt(args[number_param+1]);

        const data = new Discord.MessageEmbed()
            .setColor('#2664c7')
            .setTitle("Comando Time")
            .setAuthor('Thor', 'https://i.imgur.com/TLJLrSe.jpg', 'https://norse-mythology.org/gods-and-creatures/the-aesir-gods-and-goddesses/thor/')
            .setThumbnail('https://i.imgur.com/TLJLrSe.jpg')
            .setDescription(`Integrantes do time criado por ${message.author.username}:`)
            .setFooter('\"Thor e Jormungandr agitam o oceano entre raios e trovões!\"', false)
            .setTimestamp();

        // Add users from the voice channel to a array
        let users = [];      
        voice_channel.members.forEach(member => {
            if (!member.user.bot) users.push(member.user);
        });

        let team = '';
        if (number_param > users.length) number_param = users.length;

        // Get the team randomically from the array of users
        for (let index = 0; index < number_param; index++) {
            let rand = Math.floor(Math.random() * number_param);
            team += `<@${users.splice(rand, 1)[0].id}>\n`;
        }

        data.addField(`**Lista**`, team, false);

        message.channel.send(data)
        
        message.delete().catch(err => {
			console.error(`${now.toLocaleString("pt-BR")}:${err}`);
			message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
		});                
    },
};
