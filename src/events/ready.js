

const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);
const eventObject = languageConfig.events.ready;
const text = eventObject.text;
const returnText = eventObject.returnText;
const logText = eventObject.logText;

module.exports = {
	event: 'ready',
	execute(client, args, {config}) {
		log.success(logText.succesfullyAuthenticated.replace("{{ botTag }}", client.user.tag));
			
		const updatePresence = () => {
			let num = Math.floor(Math.random() * config.activities.length);
			client.user.setPresence({
				activity: {
					name: config.activities[num] + `  |  ${config.prefix}help`,
					type: config.activity_types[num]
				}
			}).catch(log.error);
			log.debug(logText.updatedPressence.replace("{{ activityType }}", config.activity_types[num]).replace("{{ activityText }}", config.activities[num]));
		};
		
		updatePresence();
		setInterval(() => {
			updatePresence();
		}, 15000);
		
		function updateServerStatus() {
			const fiveMServerStatus = require('../modules/fiveMServerPlayers.js');
			fiveMServerStatus.execute(client);
		}
		client.setInterval(updateServerStatus, config.reloadTime);
		
		if (client.guilds.cache.get(config.guildId).member(client.user).hasPermission('ADMINISTRATOR', false)) 
			log.success(logText.administratorGranted);
		else
			log.warn(logText.administratorMissing);
		
	}
};