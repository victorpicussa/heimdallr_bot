const ytdl = require('ytdl-core');

module.exports = {
    name: 'skipsound',
    aliases: ['pularsom', 'sksd'],
    log: false,
	type: ['Som', 'sound'],
	cooldown: 2,
	description: 'Pular sons',
	execute(message, command_name, args, queue) {
		const voice_channel = message.member.voice.channel;

		if (!voice_channel) {
			return message.reply('você não está em um canal de voz para adicionar o bot!');
		}
		
		if (message.member.roles.highest.permissions.has('SPEAK')) {
			if (!queue || (queue && !queue.songs.length)) {
				message.reply("não há sons ou uma fila de sons!");
			} else if (queue && (voice_channel != queue.voiceChannel)) {
				message.reply("você não está no mesmo canal do bot!");
			} else {
				queue.connection.dispatcher.end();
			}

			setTimeout(() => {
				message.delete().catch(err => {
					console.error(`${now.toLocaleString("pt-BR")}:${err}`);
					message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
				});
			}, 30000);
		}
	},
};