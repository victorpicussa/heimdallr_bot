const Discord = require('discord.js');
const permissions = require('../../permissions.json')

module.exports = {
	name: 'titles',
	aliases: ['titulos'],
    log: true,
    type: ['Admin', 'admin'],
	cooldown: 10,
	description: 'Informações dos títulos',
	execute(message, command_name, args) {
        // Check user permission and if guild is recorded
        if (message.member.roles.highest.permissions.has('MANAGE_MESSAGES') && permissions[message.guild.id]) {            
            const now = new Date();

            if (permissions[message.guild.id].titles) {
                const data = new Discord.MessageEmbed()
                    .setColor(`#fffffe`)
                    .setTitle("Títulos")
                    .setDescription(permissions[message.guild.id].titles.description)

                message.channel.send(data);

                Object.keys(permissions[message.guild.id].titles.tags).map(title => {
                    let re = new RegExp(`^${title}$`, 'g');
                
                    try {
                        guild_role = message.guild.roles.cache.find(role => role.name.match(re));
                    } catch (error) {
                        console.error(`${now.toLocaleString("pt-BR")}: titles :${error}`);
                        return message.reply('Não foi possível encontrar um dos cargos!');
                    }
    
                    const data = new Discord.MessageEmbed()
                        .setColor(`#${permissions[message.guild.id].titles.tags[title].color}`)
                        .setDescription(`**<@&${guild_role.id}>** | ${permissions[message.guild.id].titles.tags[title].text} \n\n *${permissions[message.guild.id].titles.tags[title].footer}*`)

                    message.channel.send(data);
                });
            }

            if (args[1] && (args[1] == this.name || this.aliases.includes(args[1]))) {
                message.delete().catch(err => {
                    console.error(`${now.toLocaleString("pt-BR")}:${err}`);
                    message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
                });
            }
        } else {
            console.log(`${now.toLocaleString("pt-BR")}: Servidor não encontrado!`);
        }
	},
};