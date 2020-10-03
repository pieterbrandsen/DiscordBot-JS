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
    async execute(client, message, args, {config}) {
        message.channel.send(`Ip: ${config.ip}
        \nF8: Connect ${config.ip}`).catch((error) => {
            log.warn('Could not send ip');
            log.error(error);
        });
    },
  };
  