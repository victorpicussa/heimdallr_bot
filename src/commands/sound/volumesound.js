const ytdl = require('ytdl-core');

module.exports = {
    name: 'volumesound',
    aliases: ['volumesom', 'vs'],
    log: false,
	usage: '[0-100] (ex: -vs 50)',
	type: ['Som', 'sound'],
    cooldown: 2,
	description: 'Volume do player',
	execute(message, command_name, args, queue) {
		const voice_channel = message.member.voice.channel;

		if (!voice_channel) {
			return message.reply('você não está em um canal de voz para alterar o bot!');
		}
		
		if (message.member.roles.highest.permissions.has('SPEAK')) {
			if (!queue || (queue && !queue.songs.length)) {
				message.reply("não há sons ou uma fila de sons!");
			} else if (queue && (voice_channel != queue.voiceChannel)) {
				message.reply("você não está no mesmo canal do bot!");
			} else {
                let volume = parseInt(args[0]);
                if (volume) {
                    queue.volume = (volume > 100) ? 100 : (volume < 0 ? 0 : volume);
                    queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);;
                } else {
                    message.reply(`${volume} não é um valor válido!`);
                }
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