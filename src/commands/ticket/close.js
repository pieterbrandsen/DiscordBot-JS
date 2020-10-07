

const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const {
	MessageEmbed
} = require('discord.js');
const fs = require('fs');
const archive = require('../../modules/archive');

module.exports = {
	name: 'sluit',
	description: 'Sluit een ticket; vermeld ticket kanaal, of het kanaal waar het commando in gebruikt wordt.',
	usage: '[ticket]',
	aliases: ['close'],
	example: 'sluit #ticket-17',
	args: false,
	async execute(client, message, args, {
		config,
		Ticket
	}) {

		const guild = client.guilds.cache.get(config.guild);

		const notTicket = new MessageEmbed()
			.setColor(config.err_colour)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle(':x: **Dit is geen ticket kanaal**')
			.setDescription('Gebruik dit commando om een ticket kanaal te sluiten in het ticket kanaal of vermeld het ticket kanaal.')
			.addField('Gebruik', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
			.addField('Help', `typ \`${config.prefix}help ${this.name}\` voor meer informatie`)
			.setFooter(guild.name, guild.iconURL());

		let ticket;
		let channel = message.mentions.channels.first();
		// || client.channels.resolve(await Ticket.findOne({ where: { id: args[0] } }).channel) // channels.fetch()

		if (!channel) {
			channel = message.channel;

			ticket = await Ticket.findOne({
				where: {
					channel: channel.id
				}
			});
			if (!ticket)
				return channel.send(notTicket);

		} else {

			ticket = await Ticket.findOne({
				where: {
					channel: channel.id
				}
			});
			if (!ticket) {
				notTicket
					.setTitle(':x: **Kanaal is niet een ticket**')
					.setDescription(`${channel} is een ticket kanaal.`);
				return message.channel.send(notTicket);
			}

			if (message.author.id !== ticket.creator && !message.member.roles.cache.has(config.staff_role))
				return channel.send(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle(':x: **Geen permissies**')
						.setDescription(`Je hebt geen permissies om ${channel} te sluiten omdat het niet jouw ticket is of je bent geen staff.`)
						.addField('Gebruik', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
						.addField('Help', `typ \`${config.prefix}help ${this.name}\` voor meer informatie`)
						.setFooter(guild.name, guild.iconURL())
				);
		}

		let success;
		let pre = fs.existsSync(`user/transcripts/ticket/text/${channel.id}.txt`) ||
			fs.existsSync(`user/transcripts/raw/${channel.id}.log`) ?
			`Je kan later een gearchiveerde versie zien met \`${config.prefix}transcript ${ticket.id}\`` :
			'';

		let confirm = await message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle(':grey_question: Weet je het zeker?')
				.setDescription(`${pre}\n**Reageer met een :white_check_mark: om te conformeren.**`)
				.setFooter(guild.name + ' | Verloopt in 15 seconden', guild.iconURL())
		);

		await confirm.react('✅');

		const collector = confirm.createReactionCollector(
			(r, u) => r.emoji.name === '✅' && u.id === message.author.id, {
				time: 15000
			});

		collector.on('collect', async () => {
			if (channel.id !== message.channel.id)
				channel.send(
					new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle('**Ticket gesloten**')
						.setDescription(`Ticket gesloten door ${message.author}`)
						.setFooter(guild.name, guild.iconURL())
				);

			confirm.reactions.removeAll();
			confirm.edit(
				new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(`:white_check_mark: **Ticket ${ticket.id} gesloten**`)
					.setDescription('Dit kanaal wordt automatisch verwijderd nadat de berichten gearchiveerd zijn.')
					.setFooter(guild.name, guild.iconURL())
			);

			if (config.transcripts.text.enabled || config.transcripts.web.enabled) {
				let u = await client.users.fetch(ticket.creator);

				if (u) {
					let dm;
					try {
						dm = u.dmChannel || await u.createDM();
					} catch (e) {
						log.warn(`Kon geen DM naar ${u.tag} sturen`);
					}


					let res = {};
					const embed = new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle(`Ticket ${ticket.id}`)
						.setFooter(guild.name, guild.iconURL());

					if (fs.existsSync(`user/transcripts/ticket/text/${ticket.get('channel')}.txt`)) {
						embed.addField('Text transcript', 'Zie bijlage');
						res.files = [{
							attachment: `user/transcripts/ticket/text/${ticket.get('channel')}.txt`,
							name: `ticket-${ticket.id}-${ticket.get('channel')}.txt`
						}];
					}

					if (
						fs.existsSync(`user/transcripts/raw/${ticket.get('channel')}.log`)
						&&
						fs.existsSync(`user/transcripts/raw/entities/${ticket.get('channel')}.json`)
					) 
						embed.addField('Web archief', `${await archive.export(Ticket, channel)}`);
						
			
					if (embed.fields.length < 1)
						embed.setDescription(`Geen tekst archief is beschikbaar voor ticket ${ticket.id}`);

					res.embed = embed;

					dm.send(res).then();
				}
			}


			// update database
			success = true;
			ticket.update({
				open: false
			}, {
				where: {
					channel: channel.id
				}
			});

			// delete messages and channel
			setTimeout(() => {
				channel.delete();
				if (channel.id !== message.channel.id)
					message.delete()
						.then(() => confirm.delete());
			}, 5000);

			log.info(`${message.author.tag} closed a ticket (#ticket-${ticket.id})`);

			if (config.logs.discord.enabled)
				client.channels.cache.get(config.logs.discord.channel).send(
					new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle('Ticket gesloten')
						.setDescription(`\`${ticket.topic}\``)
						.addField('Maker', `<@${ticket.creator}>`, true)
						.addField('Gesloten door', message.author, true)
						.addField('Id', `${ticket.id}`, true)
						.setFooter(guild.name, guild.iconURL())
						.setTimestamp()
				);
		});


		collector.on('end', () => {
			if (!success) {
				confirm.reactions.removeAll();
				confirm.edit(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle(':x: **Verlopen**')
						.setDescription('Je deed er te lang over om te reageren; Conformatie mislukt.')
						.setFooter(guild.name, guild.iconURL()));

				message.delete({
					timeout: 10000
				})
					.then(() => confirm.delete());
			}
		});

	}
};