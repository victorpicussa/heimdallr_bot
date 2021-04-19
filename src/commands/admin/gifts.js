const Discord = require('discord.js');
const permissions = require('../../permissions.json')

module.exports = {
	name: 'gifts',
	aliases: ['dadivas'],
    log: true,
    type: ['Admin', 'admin'],
	cooldown: 10,
	description: 'Informações das dádivas',
	execute(message, command_name, args) {
        // Check user permission and if guild is recorded
        if (message.member.roles.highest.permissions.has('MANAGE_MESSAGES') && permissions[message.guild.id]) {            
            const now = new Date();

            if (permissions[message.guild.id].gifts) {
                const data = new Discord.MessageEmbed()
                    .setColor(`#fffffe`)
                    .setTitle("Dádivas")
                
                let description = `${permissions[message.guild.id].gifts.description}\n\n`;

                permissions[message.guild.id].gifts.tags.forEach(gift => {
                    let re = new RegExp(`^${gift}$`, 'g');
                    
                    try {
                        guild_role = message.guild.roles.cache.find(role => role.name.match(re));
                        console.log(guild_role)
                    } catch (error) {
                        console.error(`${now.toLocaleString("pt-BR")}: gifts :${error}`);
                        return message.reply('Não foi possível encontrar um dos cargos!');
                    }
    
                    description = `${description} **<@&${guild_role.id}>**`;
                });

                description =`${description} \n\n *${permissions[message.guild.id].gifts.footer}*`;
                data.setDescription(description)

                message.channel.send(data);
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