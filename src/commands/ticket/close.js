

const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const {
	MessageEmbed
} = require('discord.js');
const fs = require('fs');
const archive = require('../../modules/archive');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.ticket.close;
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
	async execute(client, message, args, {
		config,
		Ticket
	}) {

		const guild = client.guilds.cache.get(config.guildId);

		const notTicket = new MessageEmbed()
			.setColor(config.err_colour)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle(returnText.notATicketEmbedTitle[0])
			.setDescription(returnText.notATicketDescription[0])
			.addField(returnText.notATicketEmbedField[0], returnText.notATicketEmbedField[1].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}", this.name).replace("{{ commandUsage }}", this.usage))
			.addField(returnText.notATicketEmbedField[2], returnText.notATicketEmbedField[3].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}", this.name))
			.setFooter(config.serverName, guild.iconURL());

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
					.setTitle(returnText.notAticketEmbedTitle[1])
					.setDescription(returnText.notATickerDescription[1].replace("{{ channel }}", channel))
				return message.channel.send(notTicket);
			}

			if (message.author.id !== ticket.creator && !message.member.roles.cache.has(config.staffRoleId))
				return channel.send(
					new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(returnText.noPermsEmbedTitle)
					.setDescription(returnText.noPermsDescription.replace("{{ channel }}", channel)``)
					.addField(returnText.noPermsEmbedField[0], returnText.noPermsEmbedField[1].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}".replace("{{ commandUsage }}", this.usage)))
					.addField(returnText.noPermsEmbedField[2], returnText.noPermsEmbedField[3].replace("{{ prefix }}", config.prefix).replace("{{ commandName }}"))
					.setFooter(config.serverName, guild.iconURL())
				);
		}

		let success;
		let pre = fs.existsSync(`user/transcripts/ticket/text/${channel.id}.txt`) ||
			fs.existsSync(`user/transcripts/raw/${channel.id}.log`) ?
			text.viewTranscript.replace("{{ prefix }}", config.prefix).replace("{{ ticketId }}", ticket.id) :
			'';

		let confirm = await message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle(returnText.closeTicketEmbedTitle[0])
				.setDescription(returnText.closeTicketEmbedDescription[0].replace("{{ pre }}",pre))
				.setFooter(returnText.closeTicketEmbedFooter.replace("{{ serverName }}", config.serverName), guild.iconURL())
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
						.setTitle(returnText.closeTicketEmbedTitle[1])
						.setDescription(returnText.closeTicketEmbedDescription[1].replace("{{ author }}", message.author))
						.setFooter(config.serverName, guild.iconURL())
				);

			confirm.reactions.removeAll();
			confirm.edit(
				new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(returnText.closeTicketEmbedTitle[2].replace("{{ ticketId }}", ticket.id))
					.setDescription(returnText.closeTicketEmbedDescription[2])
					.setFooter(config.serverName, guild.iconURL())
			);

			if (config.transcripts.text.enabled || config.transcripts.web.enabled) {
				let u = await client.users.fetch(ticket.creator);

				if (u) {
					let dm;
					try {
						dm = u.dmChannel || await u.createDM();
					} catch (e) {
						log.warn(logText.cantDm.replace("{{ targetuser }}", u.tag));
					}


					let res = {};
					const embed = new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle(`Ticket ${ticket.id}`)
						.setFooter(config.serverName, guild.iconURL());

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
						embed.setDescription(returnText.noArchive.replace("{{ ticketId }}", ticket.id));

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

			log.info(logText.closedTicket.replace("{{ authorTag }}", message.author.tag).replace("{{ ticketId }}", ticket.id));

			if (config.logs.discord.enabled)
				client.channels.cache.get(config.logs.discord.channel).send(
					new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle(returnText.closeTicketEmbedTitle[1])
						.setDescription(`\`${ticket.topic}\``)
						.addField(returnText.closedTicketEmbedField[0], `<@${ticket.creator}>`, true)
						.addField(returnText.closedTicketEmbedField[1], message.author, true)
						.addField(returnText.closedTicketEmbedField[2], `${ticket.id}`, true)
						.setFooter(config.serverName, guild.iconURL())
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
						.setTitle(returnText.expiredEmbedTitle)
						.setDescription(returnText.expiredEmbedDescription)
						.setFooter(config.serverName, guild.iconURL()));

				message.delete({
					timeout: 10000
				})
					.then(() => confirm.delete());
			}
		});

	}
};