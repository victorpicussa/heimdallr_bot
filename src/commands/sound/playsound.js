const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const server = require('../infos/server');

ytsr.do_warn_deprecate = false;

module.exports = {
    name: 'playsound',
    aliases: ['tocarsom', 'ps', 'ts'],
    log: false,
    usage: '[som] OU vazio para resumir (ex: -ps darude OU -ps)',
    type: ['Som', 'sound'],
    cooldown: 2,
	description: 'Reproduz ou resume sons',
	async execute(message, command_name, args, queue, timeouted, songsQueue) {
		const voice_channel = message.member.voice.channel;        
        
		if (!voice_channel) {
            return message.reply('você não está em um canal de voz para adicionar o bot!');
        }
                
        if (message.member.roles.highest.permissions.has('SPEAK')) {
            // If the user is in another channel than the bot, verify if it can change
            if (queue && (voice_channel != queue.voiceChannel)) {
				message.reply("você não está no mesmo canal do bot!");
            } else {
                if (queue) {
                    if (queue.voiceChannel != voice_channel) {
                        if (!(queue.voiceChannel.members.size-1)) {
                            queue.voiceChannel.leave();
                            songsQueue.delete(message.guild.id);
                            queue = null;
                        } else {
                            return message.reply('o bot de música já está sendo utilizado!');
                        }
                    }
                }

                if (args.length) {
                    let re = new RegExp(`www\.youtube\.com`, 'g');
                    let yt_url = args.find(element => element.match(re));
                    
                    // If the arguments isnt a link, search youtube with the arguments
                    if (!yt_url) {
                        let filtered;
                        
                        await ytsr.getFilters(args.join(' ')).then(filters => {
                            filtered = filters.get('Type').find(o => o.name === 'Video');
                        });

                        yt_url = await ytsr(null, { limit: 5, nextpageRef: filtered.ref });
                        if (yt_url) yt_url = yt_url.items[0].link;
                    }

                    if (!yt_url) return message.reply('nenhum resultado encontrado!');
                    
                    const song = await ytdl.getInfo(yt_url);
                    
                    const song_info = {
                        title: song.videoDetails.title,
                        url: song.videoDetails.video_url,
                        thumb: song.videoDetails.thumbnail.thumbnails[0].url,
                        duration: new Date(song.videoDetails.lengthSeconds * 1000).toISOString().substr(11, 8),
                        category: song.videoDetails.category,
                        views: song.videoDetails.viewCount
                    };            

                    const data = new Discord.MessageEmbed()
                        .setColor('#ff3838')
                        .setTitle(song_info.title)
                        .setURL(song_info.url)
                        .setAuthor('Youtube', 'https://i.imgur.com/bSbDlhM.png')
                        .setThumbnail(song_info.thumb)
                        .addFields(
                            { name: `**Duração**`, value: song_info.duration, inline: true },
                            { name: `**Visualizações**`, value: song_info.views, inline: true },
                            { name: `**Categoria**`, value: song_info.category, inline: true },
                        )
                        .setFooter(message.author.username, message.author.displayAvatarURL({ format: "png", dynamic: true }))
                        .setTimestamp();
                
                    clearTimeout(timeouted.timeout);
                    
                    if (!queue) {
                        // Create an object to store the queue and other infos
                        const queue_contructor = {
                            textChannel: message.channel,
                            voiceChannel: voice_channel,
                            connection: null,
                            songs: [],
                            volume: 80,
                            playing: true
                        };
                    
                        // Add the song to the queue
                        songsQueue.set(message.guild.id, queue_contructor);                    
                        queue_contructor.songs.push(song_info);
                    
                        try {
                            // Enter a channel and play the sonpm updangs
                            let connection = await voice_channel.join();
                            queue_contructor.connection = connection;
                            message.channel.send(data);
                            this.play(message.guild, queue_contructor.songs[0], songsQueue, timeouted);
                        } catch (error) {
                            const now = new Date();
                            songsQueue.delete(message.guild.id);
                            console.error(`${now.toLocaleString("pt-BR")}: ${error}`);
                            return message.reply('houve um erro ao tentar executar esse comando!');
                        }
                    } else {
                        // If there is already a queue, push the song
                        queue.songs.push(song_info);
                        message.channel.send(data);
                        if (queue.songs.length == 1) {
                            this.play(message.guild, queue.songs[0], songsQueue, timeouted);
                        }
                    }
                } else {
                    // Remuse music if there is no arguments
                    if (queue && !queue.playing) {
                        queue.playing = true;
                        clearTimeout(timeouted.timeout);
                        queue.connection.dispatcher.resume();
                    }
                }
            }
        }

        message.delete().catch(err => {
            const now = new Date();
            console.error(`${now.toLocaleString("pt-BR")}:${err}`);
            message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
        });
    },
    play(guild, song, queue, timeouted) {
        const serverQueue = queue.get(guild.id);
        
        // If there is no more songs, set a timeout to end the queue and leave channel
        if (!song || !(serverQueue.voiceChannel.members.size-1)) {
            queue.playing = false;

            if (!timeouted.timeout) {
                timeouted.timeout = setTimeout(function() { 
                    serverQueue.voiceChannel.leave();
                    queue.delete(guild.id); 
                    return;
                }, 600000);
            }
        } else {
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url))
                .on("finish", () => {
                    serverQueue.songs.shift();
                    this.play(guild, serverQueue.songs[0], queue, timeouted);
                })
                .on("error", err => {
                    const now = new Date();
                    console.error(`${now.toLocaleString("pt-BR")}:${err}`);
                    message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
                });
        
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
        }    
    }    
};
