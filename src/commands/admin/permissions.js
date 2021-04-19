const Discord = require('discord.js');
const permissions = require('../../permissions.json')
const roles = require('./roles')
const titles = require('./titles')
const gifts = require('./gifts')

module.exports = {
	name: 'permissions',
	aliases: ['permissoes'],
    log: true,
    type: ['Admin', 'admin'],
	cooldown: 10,
	description: 'Informações das permissões',
	execute(message, command_name, args) {
        // Check user permission and if guild is recorded
        if (message.member.roles.highest.permissions.has('MANAGE_MESSAGES') && permissions[message.guild.id]) {            
            roles.execute(message, command_name, args);
            titles.execute(message, command_name, args);
            gifts.execute(message, command_name, args);
            
            message.delete().catch(err => {
                console.error(`${now.toLocaleString("pt-BR")}:${err}`);
                message.channel.send('Houve um erro ao tentar deletar a mensagem nesse canal!');
            });        
        } else {
            console.log(`${now.toLocaleString("pt-BR")}: Servidor não encontrado!`);
        }
	},
};