

const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

module.exports = {
	event: 'error',
	execute(client, [e]) {
		log.error(e);
	}
};