const fs = require('fs');
const {
	MessageEmbed
} = require('discord.js');

module.exports = {
	name: 'ticketCopie',
	description: 'Krijg een copie van je ticket',
	usage: '<ticket-id>',
	aliases: ['ticketTranscript', 'ticketArchief', 'ticketArchive', 'ticketDownload'],
	example: 'copie 57',
	args: true,
	async execute(client, message, args, {config, Ticket}) {

		const guild = client.guilds.cache.get(config.guild);
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
					.setTitle(':x: **Onbekend ticket**')
					.setDescription('Kan geen gesloten ticket met dat ID')
					.setFooter(guild.name, guild.iconURL())
			);

		if (message.author.id !== ticket.creator && !message.member.roles.cache.has(config.staff_role))
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(':x: **Geen permissie**')
					.setDescription(`Je hebt geen permissie om dat ticket te zien omdat het niet jouw ticket is of je bent geen staff.`)
					.setFooter(guild.name, guild.iconURL())
			);
		let res = {};
		const embed = new MessageEmbed()
			.setColor(config.colour)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle(`Ticket ${id}`)
			.setFooter(guild.name, guild.iconURL());

		if (fs.existsSync(`user/transcripts/ticket/text/${ticket.channel}.txt`)) {
			embed.addField('Tekst Copie', 'Zie bijlage');
			res.files = [
				{
					attachment: `user/transcripts/ticket/text/${ticket.channel}.txt`,
					name: `ticket-${id}-${ticket.channel}.txt`
				}
			];
		}
			

		const BASE_URL = config.transcripts.web.server;
		if (config.transcripts.web.enabled)
			embed.addField('Web archief', `${BASE_URL}/${ticket.creator}/${ticket.channel}`);

		if (embed.fields.length < 1)
			embed.setDescription(`Geen text archief is beschikbaar voor dit ticket ${id}`);

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