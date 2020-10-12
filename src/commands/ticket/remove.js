

const { MessageEmbed } = require('discord.js');
const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.ticket.remove;
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
	async execute(client, message, args, {config, Ticket}) {
		const guild = client.guilds.cache.get(config.guildId);

		const notTicket = new MessageEmbed()
		.setColor(config.err_colour)
		.setAuthor(message.author.username, message.author.displayAvatarURL())
		.setTitle(returnText.notATicketEmbedTitle[0])
		.setDescription(returnText.notATicketDescription[0])
		.addField(returnText.notATicketEmbedField[0].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}", this.name).replace("{{ commandUsage }}", this.usage))
		.addField(this.name, returnText.notATicketEmbedField[1].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}", this.name))
		.setFooter(config.serverName, guild.iconURL());

		let ticket;

		let channel = message.mentions.channels.first();

		if(!channel) {

			channel = message.channel;
			ticket = await Ticket.findOne({ where: { channel: message.channel.id } });
			if(!ticket) 
				return message.channel.send(notTicket);

		} else {
			ticket = await Ticket.findOne({ where: { channel: channel.id } });
			if(!ticket) {
				notTicket
				.setTitle(returnText.notAticketEmbedTitle[1])
				.setDescription(returnText.notATickerDescription[1].replace("{{ channel }}", channel))
				return message.channel.send(notTicket);
			}
		}

		if(message.author.id !== ticket.creator && !message.member.roles.cache.has(config.staffRoleId))
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(returnText.noPermsEmbedTitle)
					.setDescription(returnText.noPermsDescription.replace("{{ channel }}", channel)``)
					.addField(returnText.noPermsEmbedField[0], returnText.noPermsEmbedField[1].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}".replace("{{ commandUsage }}", this.usage)))
					.addField(returnText.noPermsEmbedField[2], returnText.noPermsEmbedField[3].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}"))
					.setFooter(config.serverName, guild.iconURL())
			);
		
		

		let member = guild.member(message.mentions.users.first() || guild.members.cache.get(args[0]));
		
		if(!member) 
			return message.channel.send(
				new MessageEmbed()
				.setColor(config.err_colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle(returnText.unknownUserEmbedTitle)
				.setDescription(returnText.unknownUserEmbedDescription)
				.addField(returnText.unknownUserEmbedField[0], returnText.unknownUserEmbedField[1].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}".replace("{{ commandUsage }}", this.usage)))
				.addField(returnText.unknownUserEmbedField[2], returnText.unknownUserEmbedField[3].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}"))
				.setFooter(config.serverName, guild.iconURL())
			);

		try {
			channel.updateOverwrite(member.user, {
				VIEW_CHANNEL: false,
				SEND_MESSAGES: false,
				ATTACH_FILES: false,
				READ_MESSAGE_HISTORY: false
			});

			if(channel.id !== message.channel.id)
				channel.send(
					new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(member.user.username, member.user.displayAvatarURL())
					.setTitle(returnText.removedUserEmbedTitle)
					.setDescription(returnText.removedUserEmbedDescription.replace("{{ removedUser }}", member).replace("{{ authorUser }}", message.author))
					.setFooter(config.serverName, guild.iconURL())
				);


			
			message.channel.send(
				new MessageEmbed()
				.setColor(config.colour)
				.setAuthor(member.user.username, member.user.displayAvatarURL())
				.setTitle(returnText.userWasRemovedEmbedTitle)
				.setDescription(returnText.userWasRemovedEmbedDescription.replace("{{ removedUser }}", member).replace("{{ channelId }}", ticket.channel))
				.setFooter(config.serverName, guild.iconURL())
			);
			
			log.info(logText.removedUser.replace("{{ authorTag }}", message.author.tag).replace("{{ channelId }}", message.channel.id));
		} catch (error) {
			log.error(error);
		}
		// command ends here
	},
};
