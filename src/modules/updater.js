const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

module.exports = {
	async execute(client, config) {
		if(!config.serverStats.enabled) return;

		client.guilds.cache.forEach(guild => {
			// Server Ip //
			const serverIpChannel = require('./functions/getChannelByName.js').execute(client, Array.from(guild.channels.cache.values()), config.serverStats.ip);
			const serverIp = config.ip;
			
			if (serverIpChannel !== undefined)
			serverIpChannel.setName(`${config.serverStats.ip} ${serverIp}`);
			else {
				try {
					guild.channels.create(`${config.serverStats.ip} ${serverIp}`, {
						type: 'voice',
						parent: config.serverStats.category,
						permissionOverwrites: [{
							id: guild.roles.everyone,
							deny: ['CONNECT']
						},
						],
						reason: `Missed ServerStats channel: ${config.serverStats.ip}`
					})
				}
				catch (error) {
					log.warn(`Could not create channel for ${config.serverStats.ip}`);
					log.error(error);
				}
			}


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


			if (memberCountChannel !== undefined)
			memberCountChannel.setName(`${config.serverStats.memberCount} ${memberCount}`);
			else {
				try {
					guild.channels.create(`${config.serverStats.memberCount} ${memberCount}`, {
						type: 'voice',
						parent: config.serverStats.category,
						permissionOverwrites: [{
							id: guild.roles.everyone,
							deny: ['CONNECT']
						},
						],
						reason: `Missed ServerStats channel: ${config.serverStats.memberCount}`
					})
				}
				catch (error) {
					log.warn(`Could not create channel for ${config.serverStats.memberCount}`);
					log.error(error);
				}
			}


			// Member (No Bot) Count //
			const userCountChannel = require('./functions/getChannelByName.js').execute(client, Array.from(guild.channels.cache.values()), config.serverStats.userCount);

			if (userCountChannel !== undefined)
			userCountChannel.setName(`${config.serverStats.userCount} ${userCount}`);
			else {
				try {
					guild.channels.create(`${config.serverStats.userCount} ${userCount}`, {
						type: 'voice',
						parent: config.serverStats.category,
						permissionOverwrites: [{
							id: guild.roles.everyone,
							deny: ['CONNECT']
						},
						],
						reason: `Missed ServerStats channel: ${config.serverStats.userCount}`
					})
				}
				catch (error) {
					log.warn(`Could not create channel for ${config.serverStats.userCount}`);
					log.error(error);
				}
			}


			// Member (Bot) Count //
			const botCountChannel = require('./functions/getChannelByName.js').execute(client, Array.from(guild.channels.cache.values()), config.serverStats.botCount);

			if (botCountChannel !== undefined)
			botCountChannel.setName(`${config.serverStats.botCount} ${botCount}`);
			else {
				try {
					guild.channels.create(`${config.serverStats.botCount} ${botCount}`, {
						type: 'voice',
						parent: config.serverStats.category,
						permissionOverwrites: [{
							id: guild.roles.everyone,
							deny: ['CONNECT']
						},
						],
						reason: `Missed ServerStats channel: ${config.serverStats.botCount}`
					})
				}
				catch (error) {
					log.warn(`Could not create channel for ${config.serverStats.botCount}`);
					log.error(error);
				}
			}


			// Role Count //
			const roleCountChannel = require('./functions/getChannelByName.js').execute(client, Array.from(guild.channels.cache.values()), config.serverStats.roleCount);
			const roleCount = Array.from(guild.roles.cache.values()).length;

			if (roleCountChannel !== undefined)
			roleCountChannel.setName(`${config.serverStats.roleCount} ${roleCount}`);
			else {
				try {
					guild.channels.create(`${config.serverStats.roleCount} ${roleCount}`, {
						type: 'voice',
						parent: config.serverStats.category,
						permissionOverwrites: [{
							id: guild.roles.everyone,
							deny: ['CONNECT']
						},
						],
						reason: `Missed ServerStats channel: ${config.serverStats.roleCount}`
					})
				}
				catch (error) {
					log.warn(`Could not create channel for ${config.serverStats.roleCount}`);
					log.error(error);
				}
			}
			

			// Channel Count //
			const channelCountChannel = require('./functions/getChannelByName.js').execute(client, Array.from(guild.channels.cache.values()), config.serverStats.channelCount);
			const channelCount = Array.from(guild.channels.cache.values()).length;

			if (channelCountChannel !== undefined)
			channelCountChannel.setName(`${config.serverStats.channelCount} ${channelCount}`);
			else {
				try {
					guild.channels.create(`${config.serverStats.channelCount} ${channelCount}`, {
						type: 'voice',
						parent: config.serverStats.category,
						permissionOverwrites: [{
							id: guild.roles.everyone,
							deny: ['CONNECT']
						},
						],
						reason: `Missed ServerStats channel: ${config.serverStats.channelCount}`
					})
				}
				catch (error) {
					log.warn(`Could not create channel for ${config.serverStats.channelCount}`);
					log.error(error);
				}
			}
		});
	}
};