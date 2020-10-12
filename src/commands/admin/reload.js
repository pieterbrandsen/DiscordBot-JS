const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.admin.reload;
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
		// const targetCommandName = args[0].toLowerCase();
		// const command = message.client.commands.get(targetCommandName)
		// 	|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(targetCommandName));

		// if (!command)
		// return message.channel.send(returnText.noCommand
		// 	.replace("{{ commandBlock }}", `\`${targetCommandName}\``));

		// delete require.cache[require.resolve(`./${command.name}.js`)];

		// try {
		// 	const newCommand = require(`./${command.name}.js`);
		// 	message.client.commands.set(newCommand.name, newCommand);
        //     message.channel.send(returnText.noCommand
		// 		.replace("{{ commandBlock }}", `\`${command.name}\``));
        //     log.info(logText.reloadSuccesful
		// 		.replace("{{ commandBlock }}", `\`${command.name}\``));
		// } catch (error) {
        //     log.warn(logText.reloadError
		// 		.replace("{{ commandBlock }}", `\`${command.name}\``)
		// 		.replace("{{ errorBlock }}", `\`${error.message}\``));
		// 	log.error(error);
		// }
	},
};
