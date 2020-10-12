const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.ticket.new;
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
		
		const supportRole = guild.roles.cache.get(config.staffRoleId);
		if (!supportRole)
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setTitle(returnText.noStaffEmbedTitle)
					.setDescription(returnText.noStaffEmbedDescription.replace("{{ serverName }}", config.serverName).replace("{{ staffRoleId }}", config.stafRoleId))
					.setFooter(config.serverName, guild.iconURL())
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
					.setTitle(returnText.maxTicketsEmbedTitle.replace("{{ ticketsCount }}", tickets.count))
					.setDescription(`${returnText.maxTicketsEmbedDescription.replace("{{ prefix }}", config.prefix)}${ticketList.join(',\n')}`)
					.setFooter(returnText.maxTicketsEmbedFooter.replace("{{ serverName }}", config.serverName), guild.iconURL())
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
					.setTitle(returnText.maxDescriptionLengthEmbedTitle)
					.setDescription(returnText.maxDescriptionLengthEmbedDescription)
					.setFooter(config.serverName, guild.iconURL())
			);
		else if (topic.length < 1)
			topic = text.noSubject;


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
			reason: text.ticketCreated.replace("{{ ping }}", "").replace("{{ authorUsername }}", message.author.username)
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
					.setTitle(returnText.ticketCreatedEmbedTitle)
					.setDescription(returnText.ticketCreatedEmbedDescription.replace("{{ c }}", c))
					.setFooter(returnText.ticketCreatedEmbedFooter.replace("{{ botName }}", client.user.username), client.user.avatarURL())
			);

			setTimeout(async () => {
				await message.delete();
				await m.delete();
			}, 15000);
			
			// require('../modules/archive').create(client, c); // create files

			let ping;
			switch (config.tickets.ping) {
			case 'staff':
				ping = `<@&${config.staffRoleId}>,\n`;
				break;
			case false:
				ping = '';
				break;
			default:
				ping = `@${config.tickets.ping},\n`;
			}

			await c.send(text.ticketCreated.replace("{{ ping }}", ping).replace("{{ authorUsername }}", message.author.username));

			if (config.tickets.sendImg) {
				const images = fs.readdirSync('user/images');
				await c.send({
					files: [
						'user/images/' +
						images[Math.floor(Math.random() * images.length)]
					]
				});
			}


			let w = await c.send(
				new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setDescription(text.createdTicket[0].replace("{{ username }}", message.author.username))
					.addField(text.createdTicket[1], text.createdTicket[2].replace("{{ topic }}", topic))
					.setFooter(config.serverName, guild.iconURL())
			);

			if (config.tickets.pin)
				await w.pin();
				// await w.pin().then(m => m.delete()); // oopsie, this deletes the pinned message

			if (config.logs.discord.enabled)
				client.channels.cache.get(config.logs.discord.channel).send(
					new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle(text.newTicket)
						.setDescription(`\`${topic}\``)
						.addField(text.creator, message.author, true)
						.addField(text.channel, c, true)
						.setFooter(config.serverName, guild.iconURL())
						.setTimestamp()
				);

			log.info(logText.userCreatedTicket.replace("{{ authorTag }}", message.author.tag).replace("{{ channelName }}", name));


		}).catch(log.error);
	},
};