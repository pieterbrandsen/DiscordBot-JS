const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const { readdirSync } = require('fs');
const { join } = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Toon help menu',
	usage: '[commando]',
	aliases: ['h', 'hulp', 'command', 'commands'],
	example: 'help new',
	args: false,
	execute(client, message, args, { config }) {
		const commandFolder = './src/commands/';
		let commandCategories = [];


		readdirSync(commandFolder).forEach(item => {
			if (!item.includes('.'))
				commandCategories.push(item);
		});



		const guild = client.guilds.cache.get(config.guild);

		let commands = Array.from(client.commands.values());

		if (!args.length) {
			let cmds = [];


			for (let command of commandCategories) {
				cmds.push(`**${message} ${command}** **·** Alle commands van commando **${command}**`);
			}

			message.channel.send(
				new MessageEmbed()
					.setTitle('Catogerieën')
					.setColor(config.colour)
					.setDescription(
						`\nDe commandos waar je toegang tot hebt zijn hieronder te zien. typ \`${config.prefix}help [catogerie]\` voor meer informatie over een gekozen commando.
						\n${cmds.join('\n\n')}
						\nContact staff als je meer hulp of vragen hebt.`
					)
					.setFooter(guild.name, guild.iconURL())
			).catch((error) => {
				log.warn('Could not send help menu');
				log.error(error);
			});

		} else if (commandCategories.indexOf(args[0]) != -1) {
			commands = readdirSync(`${commandFolder}/${args[0]}`).filter(file => file.endsWith('.js'));	
			for (let i = 0; i < commands.length; i++) {
				const command = require(`./${args[0]}/${commands[i]}`);
				commands[i] = command.name;
			}
			
			let cmds = [];
			const allCommandsEmbed = new MessageEmbed()
			.setTitle(`Command's`)
			.setColor(config.colour)
			.setDescription(
				`\nDe commandos waar je toegang tot hebt zijn hieronder te zien. typ \`${config.prefix}help [command]\` voor meer informatie over een gekozen commando.
				\n\nContact staff als je meer hulp of vragen hebt.`
			)
			.setFooter(guild.name, guild.iconURL())

			for (let command of Array.from(client.commands.values())) {
				if (commands.indexOf(command.name) == -1 || command.name == "help") continue;
				if (command.hide) continue;
				if (command.permission && !message.member.hasPermission(command.permission)) continue;

				let desc = command.description;

				if (desc.length > 50)
					desc = desc.substring(0, 50) + '...';

				allCommandsEmbed.addField(`**${config.prefix}${command.name}**`, `${desc}`, true)
				cmds.push();
			}
		
			message.channel.send(allCommandsEmbed).catch((error) => {
				log.warn('Could not send help menu');
				log.error(error);
			});
		} else {
			const name = args[0].toLowerCase();
			const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command)
				return message.channel.send(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setDescription(`:x: **Onjuist commando naam** (\`${config.prefix}help\`)`)
				);


			const cmd = new MessageEmbed()
				.setColor(config.colour)
				.setTitle(command.name);

			if (command.long) {
				cmd.setDescription(command.long);
			} else {
				cmd.setDescription(command.description);
			}
			if (command.aliases) cmd.addField('aliassen', `\`${command.aliases.join(', ')}\``, true);

			if (command.usage) cmd.addField('Gebruik', `\`${config.prefix}${command.name} ${command.usage}\``, false);

			if (command.usage) cmd.addField('Voorbeeld', `\`${config.prefix}${command.example}\``, false);


			if (command.permission && !message.member.hasPermission(command.permission)) {
				cmd.addField('Benodigde Permissies', `\`${command.permission}\` :Rede: Je hebt geen permissies om dit commando te gebruiken.`, true);
			} else {
				cmd.addField('Benodigde Permissies', `\`${command.permission || 'geen'}\``, true);
			}

			message.channel.send(cmd);
		}

		// command ends here
	},
};