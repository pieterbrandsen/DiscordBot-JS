const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);
const moduleObject = languageConfig.modules.updater;
const text = moduleObject.text;
const returnText = moduleObject.returnText;
const logText = moduleObject.logText;

module.exports = {
	async execute(client, config) {
		if(!config.serverStats.enabled) return;


		function updateChannel(channel, channelName, value) {
			if (channel !== undefined)
			channel.setName(`${channelName} ${value}`);
			else {
				try {
					guild.channels.create(`${channelName} ${value}`, {
						type: 'voice',
						parent: config.serverStats.category,
						permissionOverwrites: [{
							id: guild.roles.everyone,
							deny: ['CONNECT']
						},
						],
						reason: text.missedChannel.replace("{{ channelName }}", channelName)
					})
				}
				catch (error) {
					log.warn(logText.couldntCreateChannel.replace("{{ channelName }}", channelName));
					log.error(error);
				}
			}
		}

		client.guilds.cache.forEach(guild => {
			// Server Ip //
			const serverIpChannel = require('./functions/getChannelByName.js').execute(client, Array.from(guild.channels.cache.values()), config.serverStats.ip);
			const serverIp = config.ip;
			
			updateChannel(serverIpChannel, text.ip, serverIp);


			// Member Count //
			const memberCountChannel = require('./functions/getChannelByName.js').execute(client, Array.from(guild.channels.cache.values()), config.serverStats.memberCount);
			let memberCount = 0;
			let userCount = 0;
			let botCount = 0;

			guild.members.cache.forEach(member => {
				memberCount++;
				switch (member.user.bot) {
					case false:
						userCount++;
						break;
					case true:
						botCount++;
					default:
						break;
				}
			});

			// Member (No Bot) Count //
			const userCountChannel = require('./functions/getChannelByName.js').execute(client, Array.from(guild.channels.cache.values()), config.serverStats.userCount);

			// Member (Bot) Count //
			const botCountChannel = require('./functions/getChannelByName.js').execute(client, Array.from(guild.channels.cache.values()), config.serverStats.botCount);


			updateChannel(memberCountChannel, text.memberCount, memberCount);
			updateChannel(userCountChannel, text.userCount, userCount);
			updateChannel(botCountChannel, text.botCount, botCount);
		})
	}
};