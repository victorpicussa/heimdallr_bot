module.exports = {
    name: 'reload',
    aliases: ['recarregar'],
    log: true,
    usage: '[comando] (ex: -reload help)',
    type: ['Admin', 'admin'],
	description: 'Recarrega comandos',
	execute(message, command_name, args) {
        // Check user permission to execute the command
        if (message.member.roles.highest.permissions.has('ADMINISTRATOR')) {
            // Check if there is a commando to reload
            if (!args.length) return message.channel.send(`Você não passou nenhum comando para recarregar, ${message.author}!`);
            
            const name = args[0].toLowerCase();
            const command = message.client.commands.get(name)
                || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

            if (!command) return message.channel.send(`O comando \`${name}\` não existe, ${message.author}!`);

            // Delete the command from cache
            delete require.cache[require.resolve(`../${command.type[1]}/${command.name}.js`)];

            // Try to reload the command and add to the commands list
            try {
                const new_command = require(`../${command.type[1]}/${command.name}.js`);
                message.client.commands.set(new_command.name, new_command);
                message.channel.send(`O comando \`${command.name}\` foi recarregado!`);
            } catch (error) {
                const now = Date.now();
                console.error(`${now.toLocaleString("pt-BR")}: ${error}`);
                message.channel.send(`Houve um erro ao executar o comando \`${command.name}\`:\n\`${error.message}\``);
            }
        } else {
            return message.reply('você não possui permissão para executar esse comando!');
        }
	},
};