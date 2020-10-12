const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const Discord = require('discord.js');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.admin.fiveMServerStatus;
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
	execute(client, message, args) {
		message.channel.send("NOT IN USE YET");
		// Gaat niet werken zonder een database die hij kan updaten met deze message. //

		
		// try {
		// 	let status = message.content.substr(7).trim();
		// 	let embed =  new Discord.MessageEmbed()
		// 	.setAuthor(message.member.nickname ? message.member.nickname : message.author.tag,message.author.displayAvatarURL())
		// 	.setColor(config.colour)
		// 	.setTitle('Updated status message')
		// 	.setTimestamp(new Date());
		// 	if (status === 'clear') {
		// 	STATUS = undefined;
		// 	embed.setDescription('Cleared status message');
		// 	} else {
		// 	STATUS = status;
		// 	embed.setDescription(`New message:\n\`\`\`${STATUS}\`\`\``);
		// 	}
		// 	bot.channels.get(LOG_CHANNEL).send(embed);
        //     log.info(logText.updatedSuccesful
		// 		.replace("{{ newServerStatus }}", `\`${args.join(' ')}\``));
		// } catch (error) {
        //     log.warn(logText.updatedError
		// 		.replace("{{ errorBlock }}", `\`${error.message}\``));
		// 	log.error(error);
		// }
	},
};
