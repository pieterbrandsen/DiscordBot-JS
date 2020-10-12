const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const { readdirSync } = require('fs');
const { join } = require('path');
const { MessageEmbed } = require('discord.js');

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);
const commandObject = languageConfig.commands.help;
const commandText = commandObject.command;
const text = commandObject.text;
const returnText = commandObject.returnText;
const logText = commandObject.logText;

module.exports = {
	name: commandText.name,
	description: commandText.description,
	usage: commandText.usage,
	aliases: commandText.aliases,
	example: commandText.example,
	args: commandText.args,
	permission: commandText.permission,
	execute(client, message, args, { config }) {
		const commandFolder = './src/commands/';
		let commandCategories = [];


		readdirSync(commandFolder).forEach(item => {
			if (!item.includes('.'))
				commandCategories.push(item);
		});



		const guild = message.guild;

		let commands = Array.from(client.commands.values());

			// Categories
		if (!args.length) {
			let cmds = [];


			for (let command of commandCategories) {
				cmds.push(text.commandCats.replace("{{ message }}", message.content.toLowerCase()).replace("{{ command }}", command).replace("{{ command }}", command));
			}

			message.channel.send(
				new MessageEmbed()
					.setTitle(text.accesableCatsEmbedTitle)
					.setColor(config.colour)
					.setDescription(
						`${text.accesableCommandsEmbedDescription[0].replace("{{ prefix }}", config.prefix)}
						\n${cmds.join('\n\n')}
						${text.accesableCommandsEmbedDescription[1]}`
					)
					.setFooter(config.serverName, guild.iconURL())
			).catch((error) => {
				log.warn(logText.cantSend);
				log.error(error);
			});
			// If you want to get all commands of a category //
		} else if (commandCategories.indexOf(args[0].toLowerCase()) != -1) {
			commands = readdirSync(`${commandFolder}/${args[0]}`).filter(file => file.endsWith('.js'));	
			for (let i = 0; i < commands.length; i++) {
				const command = require(`./${args[0]}/${commands[i]}`);
				commands[i] = command.name;
			}
			
			let cmds = [];
			const allCommandsEmbed = new MessageEmbed()
			.setTitle(text.accesableCommandsEmbedTitle.replace("{{ cat }}", args[0]))
			.setColor(config.colour)
			.setDescription(
				`${text.accesableCommandsEmbedDescription[0].replace("{{ prefix }}", config.prefix)}")}
				\n\n${text.accesableCommandsEmbedDescription[1]}`
			)
			.setFooter(config.serverName, guild.iconURL())

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
				log.warn(logText.cantSend);
				log.error(error);
			});
			// Get command help
		} else {
			const name = args[0].toLowerCase();
			const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command)
				return message.channel.send(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setDescription(returnText.wrongCommandName.replace("{{ prefix }}", config.prefix))
				);


			const cmd = new MessageEmbed()
				.setColor(config.colour)
				.setTitle(command.name);

			if (command.long) {
				cmd.setDescription(command.long);
			} else {
				cmd.setDescription(command.description);
			}
			if (command.aliases) cmd.addField(text.alias, `\`${command.aliases.join(', ')}\``, true);

			if (command.usage) cmd.addField(text.usage, `\`${config.prefix}${command.name} ${command.usage}\``, false);

			if (command.usage) cmd.addField(text.example, `\`${config.prefix}${command.example}\``, false);


			if (command.permission && !message.member.hasPermission(command.permission)) {
				cmd.addField(text.neededPermissions[0], `\`${command.permission}\` ${text.neededPermissions[1]}`, true);
			} else {
				cmd.addField(text.neededPermissions[0], `\`${command.permission || text.neededPermissions[2]}\``, true);
			}

			message.channel.send(cmd);
		}

		// command ends here
	},
};