const Discord = require('discord.js');

module.exports = {
    log(message, command, channel) {
        if (command.log) {
            const log = new Discord.MessageEmbed()
                .setColor('#ff8c00')
                .setTitle('Log')
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true }), '')
                .setDescription('Informações do comando executado:')
                .addFields(
                    { name: "**Conteúdo**", value: message.content, inline: true },
                    { name: "**Canal**", value: message.channel.name, inline: true },
                    { name: "**Criado**", value: message.createdAt.toLocaleString("pt-BR"), inline: true },
                )
                .setTimestamp();
            
            const channel_log = message.client.channels.cache.get(channel);
            
            if (channel_log) return channel_log.send(log);
        }
    }
}