const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');
const logger = require('./log.js');
const guilds = require('./channels.json')
const glob = require('glob')
const path = require('path')

const client = new Discord.Client();
client.commands = new Discord.Collection();

const getAllFiles = function(dirPath, arrayOfFiles) {
	files = fs.readdirSync(dirPath);
  
	arrayOfFiles = arrayOfFiles || [];
  
	files.forEach(function(file) {
		if (fs.statSync(dirPath + "/" + file).isDirectory()) {
			arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
		} else {
			if (file.endsWith('.js')) {
				arrayOfFiles.push(path.join(dirPath, file));
			}
		}
	})
  
	return arrayOfFiles;
}

const commandFiles = getAllFiles(__dirname + '/commands');

const cooldowns = new Discord.Collection();

const songsQueue = new Map();

const timeouts = new Map();

const botID = '742187768356143124';

// Set all commands
for (const file of commandFiles) {
	const command = require(file);

	client.commands.set(command.name, command);
}

client.once('ready', () => {
	const now = new Date();
	console.log(`${now.toLocaleString("pt-BR")}: Iniciado!`);
	client.user.setActivity('Asgard na Bifrost', { type: 'WATCHING' });
});

// Preccess new server members
client.on("guildMemberAdd", async (member) => {
	const guild_ids = guilds[member.guild.id];
	const guild = client.guilds.cache.get(member.guild.id);

	// Check if guild is defined in the json
	if (guild_ids) {
		const embed = new Discord.MessageEmbed()
			.setColor('#ff8c00')
			.setTitle('Bem-vindo!')
			.setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png", dynamic: true }), '')
			.setDescription(`Bem-vindo ao ${guild.name}, ${member.user}! 
			${guild_ids.rules_channel ? `Visite o canal <#${guild_ids.rules_channel}> para entender como o ${guild.name} funciona!` : ""}`)
			.setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setImage(guild_ids.welcome_image ? guild_ids.welcome_image[Math.floor(Math.random() * guild_ids.welcome_image.length)] : 'https://i.imgur.com/Q2NEHdV.jpg')
			.setFooter(guild_ids.welcome_footer)
			.setTimestamp();
	
		const channelWelcome = client.channels.cache.get(guild_ids.welcome_channel);

		// Add initial role to the new user
		if (guild_ids.initial_role) {
			let re = new RegExp(`^${guild_ids.initial_role}$`, 'g');
			const role = guild.roles.cache.find(role => role.name.match(re));
			try {
				member.roles.add(role);
			} catch (error) {
				const now = new Date();
				console.error(`${now.toLocaleString("pt-BR")}: ${error}`);	
			}
		}

		try {
			channelWelcome.send(embed);
		} catch (error) {
			const now = new Date();
			console.error(`${now.toLocaleString("pt-BR")}: ${error}`);
		}
	} else {
		console.log(`${now.toLocaleString("pt-BR")}: Servidor não encontrado!`);
	}
});

client.on("voiceStateUpdate", async (old_val, new_val) => {
	if (old_val.member.id == botID) {
		if (old_val.channelID && (!new_val.channelID || !new_val)) {
			songsQueue.delete(old_val.channel.guild.id);
		}
	}
});

// Proccess incoming messages
client.on('message', async message => {
	const guild_ids = guilds[message.member.guild.id];
	// Check if message is using the correct prefix and the author is not a bot
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	
	if (message.channel.type !== 'text') {
		return message.reply("Não posso executar esse comando dentro de DMs!");
	}

	if (message.channel.type === 'dm') return;

    const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const serverQueue = songsQueue.get(message.guild.id);

	// Check if message command exists and if it is an alias
	const command = client.commands.get(commandName)
	|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	
	if (!command) return;

	// Check message can be write in an specific channel
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('esse comando não pode ser utilizado nesse canal!');
	}

	// Check if command has arguments and if it is needed
	if (command.args && !args.length) {
		let reply = `você não colocou nenhum argumento para o comando!`;

		if (command.usage) {
			reply += `\nUso: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.reply(reply);
	}

	// Check command cooldown for a user
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	
	// Check timestamps
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`espere ${timeLeft.toFixed(1)} segundo(s) antes de usar o comando \`${command.name}\` novamente.`);
		}
	} else {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	// Try to execute the command
	try {
		if (command.type[0] == "Som") {
			let timeouted = timeouts.get(message.guild.id);
			if (!timeouted) {
				const timeout_constructor = {
					timeout: false
				}
				timeouts.set(message.guild.id, timeout_constructor);
				timeouted = timeout_constructor;
			}
			command.execute(message, command, args, serverQueue, timeouted, songsQueue);
		} else {
			command.execute(message, command, args);
		}
		if (guilds[message.channel.guild.id].log_channel) {
			logger.log(message, command, guilds[message.channel.guild.id].log_channel);
		}
	} catch (error) {
		const now = new Date();
		console.error(`${now.toLocaleString("pt-BR")}: ${error}`);
		message.reply('houve um erro ao tentar executar esse comando!');
	}
});

client.login(token);