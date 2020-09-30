

const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Toon help menu',
	usage: '[commando]',
	aliases: ['hulp', 'command', 'commands'],
	example: 'help new',
	args: false,
	execute(client, message, args, {config}) {

		const guild = client.guilds.cache.get(config.guild);
	
		const commands = Array.from(client.commands.values());

		if (!args.length) {
			let cmds = [];

			for (let command of commands) {
				if (command.hide)
					continue;
				if (command.permission && !message.member.hasPermission(command.permission)) 
					continue;

				let desc = command.description;

				if (desc.length > 50)
					desc = desc.substring(0, 50) + '...';
				cmds.push(`**${config.prefix}${command.name}** **·** ${desc}`);
			}
		
			message.channel.send(
				new MessageEmbed()
					.setTitle('Commands')
					.setColor(config.colour)
					.setDescription(
						`\nDe commandos waar je toegang tot hebt zijn hieronder te zien. typ \`${config.prefix}help [commando]\` voor meer informatie over een gekozen commando.
						\n${cmds.join('\n\n')}
						\nContact staff als je meer hulp of vragen hebt.`
					)
					.setFooter(guild.name, guild.iconURL())
			).catch((error) => {
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