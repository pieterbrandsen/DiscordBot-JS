const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

module.exports = {
    name: 'ip',
    description: 'Stuurt het IP naar de server',
    cooldown: 5,
    usage: '',
	aliases: ['connect'],
	example: 'ip',
	args: false,
    async execute(client, message, args) {
        message.channel.send(`Ip: 34.91.125.109:30120
        \nF8: Connect 34.91.125.109:30120`).catch((error) => {
            log.warn('Could not send ip');
            log.error(error);
        });
    },
  };
  