

const { MessageEmbed } = require('discord.js');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.ticket.stats;
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

		let open = await Ticket.count({ where: { open: true } });
		let closed = await Ticket.count({ where: { open: false } });

		message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setTitle(text.statsEmbedTitle)
				.addField(text.statsEmbedFields[0], open, true)
				.addField(text.statsEmbedFields[1], closed, true)
				.addField(text.statsEmbedFields[2], open + closed, true)
				.setFooter(config.serverName, guild.iconURL())
		);
	}
};