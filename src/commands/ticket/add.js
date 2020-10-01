

const { MessageEmbed } = require('discord.js');
const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

module.exports = {
	name: 'add',
	description: 'Voeg een lid toe tot een ticket kanaal',
	usage: '<@lid> [... #kanaal]',
	aliases: ['geen'],
	example: 'add @lid #ticket-23',
	args: true,
	async execute(client, message, args, {config, Ticket}) {

		const guild = client.guilds.cache.get(config.guild);

		const notTicket = new MessageEmbed()
			.setColor(config.err_colour)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle(':x: **Dit is geen ticket kanaal**')
			.setDescription('Gebruik dit commando om in een ticket kanaal iemand toe te voegen.')
			.addField('Gebruik', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
			.addField('Help', `typ \`${config.prefix}help ${this.name}\` voor meer informatie`)
			.setFooter(guild.name, guild.iconURL());

		let ticket;

		let channel = message.mentions.channels.first();

		if(!channel) {

			channel = message.channel;
			ticket = await Ticket.findOne({ where: { channel: message.channel.id } });
			if(!ticket) 
				return message.channel.send(notTicket);

		} else {
		
			ticket = await Ticket.findOne({ where: { channel: channel.id } });
			if(!ticket) {
				notTicket
					.setTitle(':x: **Kanaal is geen ticket**')
					.setDescription(`${channel} is niet een ticket kanaal.`);
				return message.channel.send(notTicket);
			}
		}

		if(message.author.id !== ticket.creator && !message.member.roles.cache.has(config.staff_role))
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(':x: **Geen permissies**')
					.setDescription(`Je hebt geen permissie om ${channel} aan te passen omdat het niet jouw ticket is of je bent geen staff.`)
					.addField('Gebruik', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
					.addField('Help', `typ \`${config.prefix}help ${this.name}\` voor meer informatie`)
					.setFooter(guild.name, guild.iconURL())
			);
		
		

		let member = guild.member(message.mentions.users.first() || guild.members.cache.get(args[0]));
		
		if(!member) 
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(':x: **Onbekend lid**')
					.setDescription('Alsjeblieft vermeld een lid.')
					.addField('Gebruik', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
					.addField('Help', `typ \`${config.prefix}help ${this.name}\` voor meer informatie`)
					.setFooter(guild.name, guild.iconURL())
			);

		try {
			channel.updateOverwrite(member.user, {
				VIEW_CHANNEL: true,
				SEND_MESSAGES: true,
				ATTACH_FILES: true,
				READ_MESSAGE_HISTORY: true
			});

			if(channel.id !== message.channel.id)
				channel.send(
					new MessageEmbed()
						.setColor(config.colour)
						.setAuthor(member.user.username, member.user.displayAvatarURL())
						.setTitle('**Lid toegevoegd**')
						.setDescription(`${member} is toegevoegd door ${message.author}`)
						.setFooter(guild.name, guild.iconURL())
				);


			
			message.channel.send(
				new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(member.user.username, member.user.displayAvatarURL())
					.setTitle(':white_check_mark: **Lid Toegevoegd**')
					.setDescription(`${member} is toegevoegd in <#${ticket.channel}>`)
					.setFooter(guild.name, guild.iconURL())
			);
			
			log.info(`${message.author.tag} added a user to a ticket (#${message.channel.id})`);
		} catch (error) {
			log.error(error);
		}
		// command ends here
	},
};
