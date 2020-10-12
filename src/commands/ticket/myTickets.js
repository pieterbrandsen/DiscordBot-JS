

const { MessageEmbed } = require('discord.js');
const fs = require('fs');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.ticket.myTickets;
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
					.setDescription(noStaffEmbedDescription.replace("{{ serverName }}", config.serverName).replace("{{ staffRoleId }}", config.stafRoleId))
					.setFooter(config.serverName, guild.iconURL())
			);

		let context = 'self';
		let user = message.mentions.users.first() || guild.members.cache.get(args[0]);
		
		if(user) {
			if(!message.member.roles.cache.has(config.staffRoleId))
				return message.channel.send(
					new MessageEmbed()
						.setColor(config.err_colour)
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTitle(returnText.noPermsEmbedTitle)
						.setDescription(returnText.noPermsEmbedDescription)
						.addField(returnText.noPermsEmbedFieldUsage, `\`${config.prefix}${this.name} ${this.usage}\`\n`)
						.addField(returnText.noPermsEmbedFieldHelp[0], returnText.noPermsEmbedFieldHelp[0].replace("{{ prefix }}", config.prefix).replace("{{ helpCommand }}", "help").replace("{{ thisCommand }}", this.command))
						.setFooter(config.serverName, guild.iconURL())
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
			.setTitle(returnText.succesfulEmbedTitle.replace("{{ user }}", context === 'self' ? 'Je' : user.username + '\'s'))
			.setFooter(returnText.succesfulEmbedFooter.replace("{{ serverName }}", config.serverName), guild.iconURL());

		
		let open = [],
			closed = [];

	
		for (let t in openTickets.rows)  {
			let desc = openTickets.rows[t].topic.substring(0, 30);
			open.push(`> <#${openTickets.rows[t].channel}>: \`${desc}${desc.length > 20 ? '...' : ''}\``);
		
		}
		
		for (let t in closedTickets.rows)  {
			if (closed.length > 15) return;
			let desc = closedTickets.rows[t].topic.substring(0, 30);
			let transcript = '';
			let c = closedTickets.rows[t].channel;
			if(fs.existsSync(`user/transcripts/ticket/text/${c}.txt`) || config.transcripts.web.enabled)
			closed.push(`> **#${closedTickets.rows[t].id}**: \`${desc}${desc.length > 20 ? '...' : ''}\``);
		}
		transcript = text.viewTranscript.replace("{{ prefix }}", config.prefix);
		closed.push(transcript)

		let pre = context === 'self' ? returnText.youHave : user.username + config.has;
		embed.addField(returnText.hasOpenTickets, openTickets.count === 0 ? `${pre} ${returnText.noOpenTickets}` : open.join('\n\n'), false);
		embed.addField(returnText.hasClosedTickets, closedTickets.count === 0 ? `${pre} ${returnText.noClosedTickets}` : closed.join('\n\n'), false);
			
		message.delete({timeout: 15000});

		let channel;
		try {
			channel = message.author.dmChannel || await message.author.createDM();
			message.channel.send(returnText.sentInDm).then(msg => msg.delete({timeout: 15000}));
		} catch (e) {
			channel = message.channel;
		}

		let m = await channel.send(embed);
		m.delete({timeout: 60000});
	},
};