

const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'tickets',
	description: 'Krijg een lijst van je recente tickets om de copieën te downloaden.',
	usage: '[@lid]',
	aliases: ['lijst', 'list'],
	example: '',
	args: false,
	async execute(client, message, args, {config, Ticket}) {

		const guild = client.guilds.cache.get(config.guild);
		
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
						.setDescription('Je hebt geen permissie om andermans tickets te bekijken omdat je geen staff bent.')
						.addField('Gebruik', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
						.addField('Help', `Typ \`${config.prefix}help ${this.name}\` voor meer informatie`)
						.setFooter(guild.name, guild.iconURL())
				);

			context = 'staff';
		} else {
			user = message.author;
		}


		let openTickets = await Ticket.findAndCountAll({
			where: {
				creator: user.id,
				open: true
			}
		});

		let closedTickets = await Ticket.findAndCountAll({
			where: {
				creator: user.id,
				open: false
			}
		});

		closedTickets.rows = closedTickets.rows.slice(-10); // get most recent 10

		let embed = new MessageEmbed()
			.setColor(config.colour)
			.setAuthor(user.username, user.displayAvatarURL())
			.setTitle(`${context === 'self' ? 'Je' : user.username + '\'s'} tickets`)
			.setFooter(guild.name + ' | Dit bericht wordt verwijderd in 60 seconden', guild.iconURL());

		if(config.transcripts.web.enabled)
			embed.setDescription(`Je kan al je ticket archieven bereiken op de [web portaal](${config.transcripts.web.server}/${user.id}).`);
		
		let open = [],
			closed = [];

	
		for (let t in openTickets.rows)  {
			let desc = openTickets.rows[t].topic.substring(0, 30);
			open.push(`> <#${openTickets.rows[t].channel}>: \`${desc}${desc.length > 20 ? '...' : ''}\``);
		
		}
		
		for (let t in closedTickets.rows)  {
			let desc = closedTickets.rows[t].topic.substring(0, 30);
			let transcript = '';
			let c = closedTickets.rows[t].channel;
			if(fs.existsSync(`user/transcripts/text/${c}.txt`) || config.transcripts.web.enabled)
				transcript = `\n> typ \`${config.prefix}transcript ${closedTickets.rows[t].id}\` om te bekijken.`;

			closed.push(`> **#${closedTickets.rows[t].id}**: \`${desc}${desc.length > 20 ? '...' : ''}\`${transcript}`);
		
		}
		let pre = context === 'self' ? 'Je hebt' : user.username + ' heeft';
		embed.addField('Open tickets', openTickets.count === 0 ? `${pre} geen open tickets.` : open.join('\n\n'), false);
		embed.addField('Gesloten tickets', closedTickets.count === 0 ? `${pre} geen oude tickets` : closed.join('\n\n'), false);
			
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