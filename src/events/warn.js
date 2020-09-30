

const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

module.exports = {
	event: 'warn',
	execute(client, [e]) {
		log.warn(e);
	}
};