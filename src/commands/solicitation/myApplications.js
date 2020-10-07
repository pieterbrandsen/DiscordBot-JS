
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'solicitaties',
	description: 'Krijg een lijst van je recente solicitaties om de copieën te downloaden.',
	usage: '[@lid]',
	aliases: ['solicitations', 'mijn-solicitaties', 'my-solicitations'],
	example: '',
	args: false,
	async execute(client, message, args, {config, Solicitation}) {
		const guild = message.guild;
		
		const supportRole = guild.roles.cache.get(config.staff_role);
		if (!supportRole)
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setTitle(':x: **Fout**')
					.setDescription(`${config.name} is niet juist geconfigureerd. Kan geen staff role vinden met het id \`${config.staff_role}\``)
					.setFooter(guild.name, guild.iconURL())
			);

		let context = 'self';
		let user = message.mentions.users.first() || guild.members.cache.get(args[0]);
		
		if(user) {
			if(!message.member.roles.cache.has(config.staff_role))
				return message.channel.send(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle(':x: **Geen permissie**')
						.setDescription('Je hebt geen permissie om andermans solicitaties te bekijken omdat je geen staff bent.')
						.addField('Gebruik', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
						.addField('Help', `Typ \`${config.prefix}help ${this.name}\` voor meer informatie`)
						.setFooter(guild.name, guild.iconURL())
				);

			context = 'staff';
		} else {
			user = message.author;
		}


		let openSolicitations = await Solicitation.findAndCountAll({
			where: {
				creator: user.id,
				open: true
			}
		});

		let closedSolicitations = await Solicitation.findAndCountAll({
			where: {
				creator: user.id,
				open: false
			}
		});

		closedSolicitations.rows = closedSolicitations.rows.slice(-10); // get most recent 10

		let embed = new MessageEmbed()
			.setColor(config.colour)
			.setAuthor(user.username, user.displayAvatarURL())
			.setTitle(`${context === 'self' ? 'Je' : user.username + '\'s'} solicitaties`)
			.setFooter(guild.name + ' | Dit bericht wordt verwijderd in 60 seconden', guild.iconURL());

		if(config.transcripts.web.enabled)
			embed.setDescription(`Je kan al je solicitaties archieven bereiken op de [web portaal](${config.transcripts.web.server}/${user.id}).`);
		
		let open = [],
			closed = [];

	
		for (let t in openSolicitations.rows)  {
			open.push(`> ${openSolicitations.rows[t].job}`);
		
		}
		
		for (let t in closedSolicitations.rows)  {
			let job = closedSolicitations.rows[t].job.substring(0, 30);
			let transcript = '';
			let c = closedSolicitations.rows[t].channel;
			if(fs.existsSync(`user/transcripts/Solicitation/text/${c}.txt`) || config.transcripts.web.enabled)
				transcript = `\n> typ \`${config.prefix}transcript ${closedSolicitations.rows[t].id}\` om te bekijken.`;

			closed.push(`> **#${closedSolicitations.rows[t].id}**: \`${job}${job.length > 20 ? '...' : ''}\`${transcript}`);
		
		}
		let pre = context === 'self' ? 'Je hebt' : user.username + ' heeft';
		embed.addField('Open solicitaties', openSolicitations.count === 0 ? `${pre} geen open solicitaties.` : open.join('\n\n'), false);
		embed.addField('Gesloten solicitaties', closedSolicitations.count === 0 ? `${pre} geen oude solicitaties` : closed.join('\n\n'), false);
			
		message.delete({timeout: 15000});

		let channel;
		try {
			channel = message.author.dmChannel || await message.author.createDM();
			message.channel.send('Verstuurt in DM').then(msg => msg.delete({timeout: 15000}));
		} catch (e) {
			channel = message.channel;
		}

		let m = await channel.send(embed);
		m.delete({timeout: 60000});
	},
};