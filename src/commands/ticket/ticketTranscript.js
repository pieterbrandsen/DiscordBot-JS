const fs = require('fs');
const {
	MessageEmbed
} = require('discord.js');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.ticket.ticketTranscript;
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
		const id = args[0];

		let ticket = await Ticket.findOne({
			where: {
				id: id,
				open: false
			}
		});


		if (!ticket)
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(returnText.unknownTicketEmbedTitle)
					.setDescription(returnText.unknownTicketEmbedDescription)
					.setFooter(config.serverName, guild.iconURL())
			);

		if (message.author.id !== ticket.creator && !message.member.roles.cache.has(config.staffRoleId))
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(returnText.noPermsEmbedTitle)
					.setDescription(returnText.noPermsEmbedDescription)
					.setFooter(config.serverName, guild.iconURL())
			);
		let res = {};
		const embed = new MessageEmbed()
			.setColor(config.colour)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle(`Ticket ${id}`)
			.setFooter(config.serverName, guild.iconURL());

		if (fs.existsSync(`user/transcripts/ticket/text/${ticket.channel}.txt`)) {
			embed.addField(text.textCopy[0], text.textCopy[1]);
			res.files = [
				{
					attachment: `user/transcripts/ticket/text/${ticket.channel}.txt`,
					name: `ticket-${id}-${ticket.channel}.txt`
				}
			];
		}
			

		if (embed.fields.length < 1)
			embed.setDescription(returnText.noArchiveAvailible.replace("{{ id }}", id));

		res.embed = embed;

		let channel;
		try {
			channel = message.author.dmChannel || await message.author.createDM();
		} catch (e) {
			channel = message.channel;
		}
			
		channel.send(res).then(m => {
			if (channel.id === message.channel.id)
				m.delete({timeout: 15000});
		});
		message.delete({timeout: 1500});
	}
};