const ytdl = require('ytdl-core');

module.exports = {
    name: 'disconnect',
    aliases: ['dc', 'disconectar'],
    log: false,
    cooldown: 10,
    type: ['Som', 'sound'],
	description: 'Disconecta o bot de um chat',
	execute(message, command_name, args, queue, timeouted, songsQueue) {
		const voice_channel = message.member.voice.channel;

        if (message.member.roles.highest.permissions.has('SPEAK')) {
            if (queue) {
                if ((voice_channel && (voice_channel.id == queue.voiceChannel.id)) || (queue.voiceChannel.id && !(queue.voiceChannel.members.size-1))) {
                    queue.voiceChannel.leave();
                    songsQueue.delete(message.guild.id);
                    queue = null;
                }
            }
        }

        setTimeout(() => {
            message.delete().catch(err => {
                const now = new Date();
                console.error(`${now.toLocaleString("pt-BR")}:${err}`);
                message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
            })
        }, 30000);
	},
};