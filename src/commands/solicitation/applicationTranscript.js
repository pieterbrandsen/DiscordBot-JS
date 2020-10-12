const fs = require('fs');
const {	MessageEmbed } = require('discord.js');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.solicitation.applicationTranscript;
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
	async execute(client, message, args, {config, Solicitation}) {
		const guild = message.guild;
		const id = args[0];

		let findSolicitation = await Solicitation.findOne({
			where: {
				id: id,
				open: false
			}
		});


		if (!findSolicitation)
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(returnText.nothingFoundEmbedTitle)
					.setDescription(returnText.nothingFoundEmbedDescription)
					.setFooter(config.serverName, guild.iconURL())
			);

		if (message.author.id !== findSolicitation.creator && !message.member.roles.cache.has(config.staffRoleId))
			return message.channel.send(
				new MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(returnText.noPermissionEmbedTitle)
					.setDescription(returnText.noPermissionEmbedDescription)
					.setFooter(config.serverName, guild.iconURL())
			);
		let res = {};
		const embed = new MessageEmbed()
			.setColor(config.colour)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle(returnText.sendingEmbedTitle.replace("{{ id }}", id))
			.setFooter(config.serverName, guild.iconURL());

		if (fs.existsSync(`user/transcripts/Solicitation/text/${id}${message.author.id}.txt`)) {
			embed.addField(returnText.sendingEmbedField[0],returnText.sendingEmbedField[1]);
			res.files = [
				{
					attachment: `user/transcripts/Solicitation/text/${id}${message.author.id}.txt`,
					name: `Solicitation-${id}.txt`
				}
			];
		}
			

		res.embed = embed;

		let channel;
		try {
			channel = message.author.dmChannel || await message.author.createDM();
		} catch (e) {
			channel = message.channel;
		}
			
		channel.send(res).then(m => {
			if (channel.id === message.channel.id)
				m.delete({timeout: 15000});
		});
		message.delete({timeout: 15000});
	}
};