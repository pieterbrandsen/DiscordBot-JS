const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

module.exports = {
	name: 'herlaad',
	description: 'Herlaad een commando',
    usage: '[commando]',
	aliases: ['reload'],
    example: 'herlaad ping',
    permission: 'ADMINISTRATOR',
	args: true,
	execute(client, message, args) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command)
        return message.channel.send(`Er is geen commando met die naam \`${commandName}\``);

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Commando \`${command.name}\` is herladen!`);
            log.info(`Command \`${command.name}\` was reloaded!`);
		} catch (error) {
            log.warn(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
			log.error(error);
		}
	},
};
