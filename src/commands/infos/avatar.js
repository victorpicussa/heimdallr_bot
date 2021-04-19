const Discord = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['icone', 'icon', 'imgperfil'],
    args: false,
    usage: '[usuarios] (ex: -avatar @Heimdallr)',
    log: true,
    type: ['Informações', 'infos'],
    cooldown: 5,
	description: 'Avatar do usuário',
	execute(message, command_name, args) {
        const data = new Discord.MessageEmbed()
            .setColor('#701ec7')
            .setTitle('Comando Avatar')
            .setAuthor('Loki', 'https://i.imgur.com/tIoFcqD.jpg', 'https://norse-mythology.org/gods-and-creatures/the-aesir-gods-and-goddesses/loki/')            
            .setThumbnail('https://i.imgur.com/tIoFcqD.jpg')
            .setTimestamp()
            .setFooter('\"É claro que foi o Loki. É sempre o Loki.\"', false);

        // Check if there is mentions, if true, return avatar of every mentioned members
        if (!message.mentions.users.size) {
            data.setDescription(`Avatar de <@${message.author.id}>:`);
            data.setImage(message.author.displayAvatarURL({ format: "png", dynamic: true }));
            return message.channel.send(data);
        } else {
            message.mentions.users.map(user => {
                data.setDescription(`Avatar de <@${user.id}>:`);
                data.setImage(user.displayAvatarURL({ format: "png", dynamic: true }));            
                message.channel.send(data);
            });
        }
        
        message.delete().catch(err => {
			console.error(`${now.toLocaleString("pt-BR")}:${err}`);
			message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
		});                
    },
};
