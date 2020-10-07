

const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const config = require('../../user/' + require('../').config);

module.exports = {
	event: 'ready',
	execute(client) {
		log.success(`Authenticated as ${client.user.tag}`);
			
		const updatePresence = () => {
			let num = Math.floor(Math.random() * config.activities.length);
			client.user.setPresence({
				activity: {
					name: config.activities[num] + `  |  ${config.prefix}help`,
					type: config.activity_types[num]
				}
			}).catch(log.error);
			log.debug(`Updated presence: ${config.activity_types[num]} ${config.activities[num]}`);
		};
		
		updatePresence();
		setInterval(() => {
			updatePresence();
		}, 15000);
		
		function updateServerStatus() {
			const fiveMServerStatus = require('../modules/fiveMServerStats');
			fiveMServerStatus.execute(client);
		}
		client.setInterval(updateServerStatus, config.UPDATE_TIME);
		
		if (client.guilds.cache.get(config.guild).member(client.user).hasPermission('ADMINISTRATOR', false)) 
			log.success('\'ADMINISTRATOR\' permission has been granted');
		else
			log.warn('Bot does not have \'ADMINISTRATOR\' permission');
		
	}
};