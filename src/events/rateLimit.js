const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);
const eventObject = languageConfig.events.rateLimit;
const text = eventObject.text;
const returnText = eventObject.returnText;
const logText = eventObject.logText;

module.exports = {
	event: 'rateLimit',
	execute(client, [limit]) {
		log.warn(logText.rateLimited);
		log.debug(limit);
	}
};