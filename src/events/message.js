

const { Collection, MessageEmbed } = require('discord.js');
const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const archive = require('../modules/archive');

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);
const eventObject = languageConfig.events.message;
const text = eventObject.text;
const returnText = eventObject.returnText;
const logText = eventObject.logText;

module.exports = {
	event: 'message',
	async execute(client, [message], {config, Ticket, Solicitation, Setting}) {
		const guild = client.guilds.cache.get(config.guildId);

		// if (message.content.includes("<@")) return;

		if (message.channel.type === 'dm' && !message.author.bot) {
			log.console(logText.dmMessage.replace("{{ authorTag }}", message.author.tag).replace("{{ cleanMessage }}", message.cleanContent));
			return;
// 			return message.channel.send(`Hallotjes ${message.author.username}!
// Ik ben een support bot voor **${guild}**.
// typ \`${config.prefix}ticket\` op de server om een nieuw ticket te maken.

// Voer commando's uit in de server uit.`);
		} // stop here if is DM
	
		/**
		 * Ticket transcripts
		 * (bots currently still allowed)
		 */
		
		let ticket = await Ticket.findOne({ where: { channel: message.channel.id } });
		if(ticket) 
		archive.add(message, "ticket"); // add message to archive

		if (message.author.bot || message.author.id === client.user.id) return; // goodbye bots
		/**
		 * Command handler
		 * (no bots / self)
		 */

		const regex = new RegExp(`^(<@!?${client.user.id}>|\\${config.prefix})\\s*`);
		if (!regex.test(message.content)) return; // not a command

		const [, prefix] = message.content.match(regex);
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		
		if (!command || commandName === 'none') return; // not an existing command

		if (command.permission && !message.member.hasPermission(command.permission)) {
			log.console(logText.userHasNoCommandPerms.replace("{{ authorTag }}", message.author.tag).replace("{{ commandName }}", command.name));
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setTitle(returnText.noPermsEmbedTitle)
					.setDescription(returnText.noPermsEmbedDescription.replace("{{ commandName }}", command.name).replace("{{ commandPerms }}", command.permission))
					.setFooter(config.serverName, guild.iconURL())
			);
		}

		if (command.args && !args.length)
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.addField(returnText.needsArgsEmbedFields[0], returnText.needsArgsEmbedFields[1].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}", command.name).replace("{{ commandUsage }}", command.usage))
					.addField(returnText.needsArgsEmbedFields[2], returnText.needsArgsEmbedFields[3].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}", command.name))
					.setFooter(config.serverName, guild.iconURL())
			);

		if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Collection());
	
		const now = Date.now();
		const timestamps = client.cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || config.cooldown) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				log.console(logText.stillCooldown.replace("{{ authorTag }}", message.author.tag).replace("{{ commandName }}"));
				return message.channel.send(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setDescription(text.stillCooldown.replace("{{ cooldown }}", timeLeft.toFixed(1)).replace("{{ commandName }}", command.name))
						.setFooter(config.serverName, guild.iconURL())
				);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		try {
			command.execute(client, message, args, {config, Ticket, Solicitation, Setting});
			log.console(logText.userUsedCommand.replace("{{ authorTag }}", message.author.tag).replace("{{ commandName }}", command.name));
		} catch (error) {
			log.warn(logText.errorWhileExecutingCommand.replace("{{ commandName }}", command.name));
			log.error(error);
			message.channel.send(returnText.errorWithCommand.replace("{{ commandName }}", command.name));
		}
	}
};