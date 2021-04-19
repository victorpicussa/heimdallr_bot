const Discord = require('discord.js');

module.exports = {
	name: 'user',
	aliases: ['usuario', 'user-info', 'usuario-info'],
	log: false,
	type: ['Informações', 'infos'],
	cooldown: 10,
	description: 'Informações do usuário',
	execute(message, command_name, args) {
		const data = new Discord.MessageEmbed()
			.setColor('#f2f2f2')
			.setTitle('Comando Avatar')
			.setAuthor('Vidar', 'https://i.imgur.com/xzoZZ8O.jpg', 'https://norse-mythology.org/vidar/')            
			.setThumbnail('https://i.imgur.com/xzoZZ8O.jpg')
			.setTimestamp()
			.setDescription("Informações de usuário:")
			.addFields(
				{ name: "**Nome**", value: message.author.username, inline: true },
				{ name: "**Difere**", value: message.author.discriminator, inline: true },
				{ name: "**Entrou**", value: message.member.joinedAt.toLocaleString("pt-BR"), inline: true},

			)
			.setFooter('\"A vingança será a cabeça de Fenrir!\"', false);

		message.channel.send(data);

		message.delete().catch(err => {
			console.error(`${now.toLocaleString("pt-BR")}:${err}`);
			message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
		});
	},
};
