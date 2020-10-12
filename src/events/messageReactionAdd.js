

const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);
const eventObject = languageConfig.events.messageReactionAdd;
const text = eventObject.text;
const returnText = eventObject.returnText;
const logText = eventObject.logText;

module.exports = {
	event: 'messageReactionAdd',
	async execute(client, [r, u], {config, Ticket, Setting}) {

		if (r.partial) 
			try {
				await r.fetch();
			} catch (err) {
				log.error(err);
				return;
			}

		let panelID = await Setting.findOne({ where: { key: 'panel_msg_id' } });
		if (!panelID) return;

		if(r.message.id !== panelID.get('value')) return;

		if(u.id === client.user.id) return;

		if (r.emoji.name !== config.tickets.panelReaction && r.emoji.id !== config.tickets.panelReaction) return;

		let channel = r.message.channel;

		const supportRole = channel.guild.roles.cache.get(config.staffRoleId);
		if (!supportRole)
			return channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setTitle(returnText.noStaffEmbedTitle)
					.setDescription(returnText.noStaffEmbedDescription.replace("{{ serverName }}", config.serverName).replace("{{ staffRoleId }}", config.staffRoleId))
					.setFooter(channel.config.serverName, channel.guild.iconURL())
			);


		// everything is cool

		await r.users.remove(u.id); // effectively cancel reaction

		let tickets = await Ticket.findAndCountAll({
			where: {
				creator: u.id,
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
			let dm = u.dmChannel || await u.createDM();

			try {

				return dm.send(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setAuthor(u.username, u.displayAvatarURL())
						.setTitle(returnText.maxTicketsEmbedTitle.replace("{{ count }}", tickets.count))
						.setDescription(returnText.maxTicketsEmbedDescription.replace("{{ prefix }}", config.prefix).replace("{{ ticketList }}", ticketList.join(',\n')))
						.setFooter(channel.config.serverName, channel.guild.iconURL())
				);
		

			} catch (e) {

				let m = await channel.send(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setAuthor(u.username, u.displayAvatarURL())
						.setTitle(returnText.maxTicketsEmbedTitle.replace("{{ count }}", tickets.count))
						.setDescription(returnText.maxTicketsEmbedDescription.replace("{{ prefix }}", config.prefix).replace("{{ ticketList }}", ticketList.join(',\n')))
						.setFooter(returnText.noStaffEmbedFooter.replace("{{ serverName }}", config.serverName), channel.guild.iconURL())
				);
		
				return m.delete({ timeout: 15000 });
			}
				
			
		}

		let topic = text.noSubject;

		let ticket = await Ticket.create({
			channel: '',
			creator: u.id,
			open: true,
			archived: false,
			topic: topic
		});

		let name = `ticket-${ticket.id}`;

		channel.guild.channels.create(name, {
			type: 'text',
			topic: `${u} | ${topic}`,
			parent: config.tickets.category,
			permissionOverwrites: [{
				id: channel.guild.roles.everyone,
				deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
			},
			{
				id: channel.guild.member(u),
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']
			},
			{
				id: supportRole,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']
			}
			],
			reason: text.madeTicketSubject
		}).then(async c => {

			Ticket.update({
				channel: c.id
			}, {
				where: {
					id: ticket.id
				}
			});

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
			await c.send(text.madeTicket.replace("{{ ping }}", ping).replace("{{ username }}", u.username));

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
					.setAuthor(u.username, u.displayAvatarURL())
					.setDescription(text.createdTicketUsingPanel[0].replace("{{ username }}", u.username))
					.addField(text.createdTicketUsingPanel[1], text.createdTicketUsingPanel[2].replace("{{ topic }}", topic))
					.setFooter(channel.config.serverName, channel.guild.iconURL())
			);

			if (config.tickets.pin)
				await w.pin();
				// await w.pin().then(m => m.delete()); // oopsie, this deletes the pinned message

			if (config.logs.discord.enabled)
				client.channels.cache.get(config.logs.discord.channel).send(
					new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(u.username, u.displayAvatarURL())
						.setTitle(returnText.newTicketEmbedTitle)
						.setDescription(`\`${topic}\``)
						.addField(returnText.newTicketEmbedFields[0], u, true)
						.addField(returnText.newTicketEmbedFields[1], c, true)
						.setFooter(channel.config.serverName, channel.guild.iconURL())
						.setTimestamp()
				);

			log.info(logText.userCreatedNewTicket.replace("{{ authorTag }}", u.tag).replace("{{ channelName }}", name));


		}).catch(log.error);
	}
};