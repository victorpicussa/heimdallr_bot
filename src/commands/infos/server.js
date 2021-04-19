const Discord = require('discord.js');

module.exports = {
	name: 'server',
	aliases: ['servidor', 'server-info', 'servidor-info'],
	args: false,
	guild: false,
	log: true,
	type: ['Informações', 'infos'],
	cooldown: 10,
	description: 'Informações do servidor',
	execute(message, command_name, args) {
		const data = new Discord.MessageEmbed()
            .setColor('#a6a6a6')
            .setTitle('Comando Servidor')
            .setAuthor('Ymir', 'https://i.imgur.com/IVBuEi6.jpg', 'https://norse-mythology.org/gods-and-creatures/giants/ymir/')            
            .setThumbnail('https://i.imgur.com/IVBuEi6.jpg')
            .setTimestamp()
			.setFooter('\"E da carne de Ymir, a terra foi criada.\"', false)
			.setDescription(`Informações do servidor:`)
			.addFields(
				{ name: '**Nome**', value: message.guild.name, inline: true },
				{ name: '**Membros**', value: message.guild.memberCount, inline: true },				
				{ name: '**Criado**', value: message.guild.createdAt.toLocaleString("pt-BR"), inline: true },
			);

		message.channel.send(data);

		message.delete().catch(err => {
			console.error(`${now.toLocaleString("pt-BR")}:${err}`);
			message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
		});
	},
};