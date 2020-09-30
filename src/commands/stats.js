

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'stats',
	description: 'View ticket stats.',
	usage: '',
	aliases: ['statistieken', 'statistiek', 'data', 'statistics', 'stats'],
	example: '',
	args: false,
	async execute(client, message, args, {config, Ticket}) {

		const guild = client.guilds.cache.get(config.guild);

		let open = await Ticket.count({ where: { open: true } });
		let closed = await Ticket.count({ where: { open: false } });

		message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setTitle(':bar_chart: Statistieken')
				.addField('Open tickets', open, true)
				.addField('Gesloten tickets', closed, true)
				.addField('Totaal tickets', open + closed, true)
				.setFooter(guild.name, guild.iconURL())
		);
	}
};