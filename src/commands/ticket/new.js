

const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'ticket',
	description: 'Maak een nieuw support ticket',
	usage: '[onderwerp]',
	aliases: ['new', 'nieuw', 'open'],
	example: 'ticket ik kan niet joinen',
	args: false,
	async execute(client, message, args, {config, Ticket}) {
		
		const guild = client.guilds.cache.get(config.guild);
		
		const supportRole = guild.roles.cache.get(config.staff_role);
		if (!supportRole)
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setTitle(':x: **Fout**')
					.setDescription(`${config.name} is niet juist opgesteld. Kan geen support team vinden met het role id \`${config.staff_role}\``)
					.setFooter(guild.name, guild.iconURL())
			);


		let tickets = await Ticket.findAndCountAll({
			where: {
				creator: message.author.id,
				open: true
			},
			limit: config.tickets.max
		});

		if (tickets.count >= config.tickets.max) {
			let ticketList = [];
			for (let t in tickets.rows)  {
				let desc = tickets.rows[t].topic.substring(0, 30);
				ticketList
					.push(`<#${tickets.rows[t].channel}>: \`${desc}${desc.length > 30 ? '...' : ''}\``);
			}		
			
			let m = await message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(`:x: **Je hebt al ${tickets.count} of meer open tickets**`)
					.setDescription(`Gebruik \`${config.prefix}close\` om onnodige tickets te sluiten.\n\n${ticketList.join(',\n')}`)
					.setFooter(guild.name + ' | Dit bericht wordt verwijderd in 15 seconden', guild.iconURL())
			);

			return setTimeout(async () => {
				await message.delete();
				await m.delete();
			}, 15000);
		}
			

		let topic = args.join(' ');
		if (topic.length > 256)
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(':x: **Descriptie is te lang**')
					.setDescription('Limiteer je ticket onderwerp, maximaal 255 karakters. Een korte zin is genoeg.')
					.setFooter(guild.name, guild.iconURL())
			);
		else if (topic.length < 1)
			topic = 'Geen onderwerp ingevoerd';


		let ticket = await Ticket.create({
			channel: '',
			creator: message.author.id,
			open: true,
			archived: false,
			topic: topic
		});

		let name = 'ticket-' + ticket.get('id');

		guild.channels.create(name, {
			type: 'text',
			topic: `${message.author} | ${topic}`,
			parent: config.tickets.category,
			permissionOverwrites: [{
				id: guild.roles.everyone,
				deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
			},
			{
				id: message.member,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']
			},
			{
				id: supportRole,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']
			}
			],
			reason: 'User requested a new support ticket channel'
		}).then(async c => {

			Ticket.update({
				channel: c.id
			}, {
				where: {
					id: ticket.id
				}
			});

			let m = await message.channel.send(
				new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(':white_check_mark: **Ticket gemaakt**')
					.setDescription(`Je ticket is gemaakt: ${c}`)
					.setFooter(client.user.username + ' | Dit bericht wordt in 15 seconden verwijderd', client.user.avatarURL())
			);

			setTimeout(async () => {
				await message.delete();
				await m.delete();
			}, 15000);
			
			// require('../modules/archive').create(client, c); // create files

			let ping;
			switch (config.tickets.ping) {
			case 'staff':
				ping = `<@&${config.staff_role}>,\n`;
				break;
			case false:
				ping = '';
				break;
			default:
				ping = `@${config.tickets.ping},\n`;
			}

			await c.send(`${ping} ${message.author.username} heeft een nieuw ticket gemaakt`);

			if (config.tickets.send_img) {
				const images = fs.readdirSync('user/images');
				await c.send({
					files: [
						'user/images/' +
						images[Math.floor(Math.random() * images.length)]
					]
				});
			}

			let text = config.tickets.text
				.replace('{{ name }}', message.author.username)
				.replace('{{ tag }}', message.author);


			let w = await c.send(
				new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setDescription(text)
					.addField('Onderwerp', `\`${topic}\``)
					.setFooter(guild.name, guild.iconURL())
			);

			if (config.tickets.pin)
				await w.pin();
				// await w.pin().then(m => m.delete()); // oopsie, this deletes the pinned message

			if (config.logs.discord.enabled)
				client.channels.cache.get(config.logs.discord.channel).send(
					new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle('Nieuw ticket')
						.setDescription(`\`${topic}\``)
						.addField('Maker', message.author, true)
						.addField('Kanaal', c, true)
						.setFooter(guild.name, guild.iconURL())
						.setTimestamp()
				);

			log.info(`${message.author.tag} created a new ticket (#${name})`);


		}).catch(log.error);
	},
};