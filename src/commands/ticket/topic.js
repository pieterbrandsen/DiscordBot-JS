

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'onderwerp',
	description: 'Bewerk een ticket naam',
	usage: '<onderwerp>',
	aliases: ['onderwerp', 'topic', 'edit'],
	example: 'onderwerp ticket is klaar',
	args: true,
	async execute(client, message, args, {config, Ticket}) {

		const guild = client.guilds.cache.get(config.guild);

		let ticket = await Ticket.findOne({
			where: {
				channel: message.channel.id
			}
		});

		if (!ticket)
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(':x: **Dit is geen ticket kanaal**')
					.setDescription('Gebruik dit commando in een ticket kanaal waar je het onderwerp van wilt veranderen, of vermeld het kanaal.')
					.addField('Usage', `\`${config.prefix}${this.name} ${this.usage}\`\n`)
					.addField('Help', `Type \`${config.prefix}help ${this.name}\` for more information`)
					.setFooter(guild.name, guild.iconURL())
			);


		let topic = args.join(' ');
		if (topic.length > 256)
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(':x: **Beschrijving te lang**')
					.setDescription('Alsjeblieft limiteer jezelf op een ticket onderwerp van minder dan 256 karakters. Een korte zin is al goed.')
					.setFooter(guild.name, guild.iconURL())
			);	

		message.channel.setTopic(`<@${ticket.creator}> | ` + topic);
			
		Ticket.update({
			topic: topic
		}, {
			where: {
				channel: message.channel.id
			}
		});


		message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setTitle(':white_check_mark: **Ticket geupdate**')
				.setDescription('Het onderwerp is veranderd.')
				.setFooter(client.user.username, client.user.avatarURL())
		);
	}
};