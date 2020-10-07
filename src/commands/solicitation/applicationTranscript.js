const fs = require('fs');
const {
	MessageEmbed
} = require('discord.js');

module.exports = {
	name: 'solicitatie-copie',
	description: 'Krijg een copie van je solicitatie',
	usage: '<solicitatie-id>',
	aliases: ['solicitatie-transcript', 'solicitatie-archief', 'solicitatie-archive', 'solicitatie-download'],
	example: 'solicitatieCopie 57',
	args: true,
	async execute(client, message, args, {config, Solicitation}) {
		const guild = message.guild;
		const id = args[0];

		let findSolicitation = await Solicitation.findOne({
			where: {
				id: id,
				open: false
			}
		});


		if (!findSolicitation)
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(':x: **Onbekende sollicitatie**')
					.setDescription('Kan geen gesloten sollicitatie vinden met dat ID')
					.setFooter(guild.name, guild.iconURL())
			);

		if (message.author.id !== findSolicitation.creator && !message.member.roles.cache.has(config.staff_role))
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(':x: **Geen permissie**')
					.setDescription(`Je hebt geen permissie om die sollicitatie te zien omdat het niet jouw solicitatie is of je bent geen staff.`)
					.setFooter(guild.name, guild.iconURL())
			);
		let res = {};
		const embed = new MessageEmbed()
			.setColor(config.colour)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle(`Applicatie ${id}`)
			.setFooter(guild.name, guild.iconURL());

		if (fs.existsSync(`user/transcripts/Solicitation/text/${id}${message.author.id}.txt`)) {
			embed.addField('Tekst Copie', 'Zie bijlage');
			res.files = [
				{
					attachment: `user/transcripts/Solicitation/text/${id}${message.author.id}.txt`,
					name: `Solicitation-${id}.txt`
				}
			];
		}
			

		const BASE_URL = config.transcripts.web.server;
		if (config.transcripts.web.enabled)
			embed.addField('Web archief', `${BASE_URL}/${findSolicitation.creator}/${findSolicitation.channel}`);

		if (embed.fields.length < 1)
			embed.setDescription(`Geen text archief is beschikbaar voor deze applicatie ${id}`);

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