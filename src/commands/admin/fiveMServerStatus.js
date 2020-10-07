const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandText = languageConfig.admin.fiveMServerStatus.command;
const text = languageConfig.admin.fiveMServerStatus.text;
const returnText = languageConfig.admin.fiveMServerStatus.returnText;
const logText = languageConfig.admin.fiveMServerStatus.logText;

module.exports = {
	name: commandText.name,
	description: commandText.description,
    usage: commandText.usage,
	aliases: commandText.aliases,
    example: commandText.example,
	args: commandText.args,
    permission: commandText.permission,
	execute(client, message, args) {
		// try {
		// 	let status = message.content.substr(7).trim();
		// 	let embed =  new Discord.RichEmbed()
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
