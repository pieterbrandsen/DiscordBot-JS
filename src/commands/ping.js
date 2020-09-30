const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

module.exports = {
    name: 'ping',
    description: 'Check of de bot nog werkt',
    cooldown: 5,
    usage: '',
	aliases: ['peng'],
	example: 'ping',
	args: false,
    async execute(client, message, args) {
        message.channel.send(`Pong!`).catch((error) => {
            log.warn('Could not send Pong');
            log.error(error);
        });
    },
  };
  