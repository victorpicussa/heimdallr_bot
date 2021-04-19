const Discord = require('discord.js');
const permissions = require('../../permissions.json')

module.exports = {
	name: 'roles',
	aliases: ['cargos'],
    log: true,
    type: ['Admin', 'admin'],
	cooldown: 10,
	description: 'Informações dos cargos',
	execute(message, command_name, args) {
        // Check user permission and if guild is recorded
        if (message.member.roles.highest.permissions.has('MANAGE_MESSAGES') && permissions[message.guild.id]) {            
            const now = new Date();

            if (permissions[message.guild.id].roles) {
                const data = new Discord.MessageEmbed()
                    .setColor(`#fffffe`)
                    .setTitle("Cargos")
                    .setDescription(permissions[message.guild.id].roles.description)

                message.channel.send(data);

                Object.keys(permissions[message.guild.id].roles.tags).map(role => {
                    let re = new RegExp(`^${role}$`, 'g');
                
                    try {
                        guild_role = message.guild.roles.cache.find(role => role.name.match(re));
                    } catch (error) {
                        console.error(`${now.toLocaleString("pt-BR")}: roles :${error}`);
                        return message.reply('Não foi possível encontrar um dos cargos!');
                    }
    
                    const data = new Discord.MessageEmbed()
                        .setColor(`#${permissions[message.guild.id].roles.tags[role].color}`)
                        .setDescription(`**<@&${guild_role.id}>** | ${permissions[message.guild.id].roles.tags[role].text} \n\n *${permissions[message.guild.id].roles.tags[role].footer}*`)

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