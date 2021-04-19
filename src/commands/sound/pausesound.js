const ytdl = require('ytdl-core');

module.exports = {
    name: 'pausesound',
    aliases: ['pararsom', 'pesd'],
	log: false,
	type: ['Som', 'sound'],
	cooldown: 2,
	description: 'Pausar som',
	execute(message, command_name, args, queue, timeouted, songsQueue) {
		const voice_channel = message.member.voice.channel;

		if (!voice_channel) {
			return message.reply('você não está em um canal de voz para adicionar o bot!');
		}
		
		if (message.member.roles.highest.permissions.has('SPEAK')) {
			if (queue && (voice_channel != queue.voiceChannel)) {
				message.reply("você não está no mesmo canal do bot!");
			} else if (queue && queue.songs.length && queue.playing) {
				queue.playing = false;
				if (!timeouted.timeout) {
					timeouted.timeout = setTimeout(function() { 
						queue.voiceChannel.leave();
						songsQueue.delete(message.guild.id); 
						return;
					}, 960000);
				}
				queue.connection.dispatcher.pause();
			} else {
				message.reply("não há sons ou uma fila de sons!");
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