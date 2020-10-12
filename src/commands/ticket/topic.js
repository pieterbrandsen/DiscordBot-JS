

const { MessageEmbed } = require('discord.js');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.ticket.topic;
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

		let ticket = await Ticket.findOne({
			where: {
				channel: message.channel.id
			}
		});

		if (!ticket)
			return message.channel.send(
				new MessageEmbed()
				.setColor(config.err_colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle(returnText.notAticketEmbedTitle)
				.setDescription(returnText.notATickerDescription)
				.addField(returnText.notAticketEmbedField.replace("{{ prefix }}", config.prefix).replace("{{ commandName }}", this.name).replace("{{ commandUsage }}", this.usage))
				.addField(this.name, notAticketEmbedField.replace("{{ prefix }}", config.prefix).replace("{{ commandName }}", this.name))
				.setFooter(config.serverName, guild.iconURL())
			);


		let topic = args.join(' ');
		if (topic.length > 256)
			return message.channel.send(
				new MessageEmbed()
				.setColor(config.err_colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle(returnText.maxDescriptionLengthEmbedTitle)
				.setDescription(returnText.maxDescriptionLengthEmbedDescription)
				.setFooter(config.serverName, guild.iconURL())
			);	

		message.channel.setTopic(`<@${ticket.creator}> | ` + topic);
			
		Ticket.update({
			topic: topic
		}, {
			where: {
				channel: message.channel.id
			}
		});


		message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle(returnText.ticketUpdatedEmbedTitle)
				.setDescription(returnText.ticketUpdatedEmbedDescription)
				.setFooter(client.user.username, client.user.avatarURL())
		);
	}
};