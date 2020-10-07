const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

module.exports = {
    event: 'guildMemberRemove',
    async execute(client, [member], {config}) {
        log.info(`A User "${member.user.username}" has left "${member.guild.name}"` );
        require('../modules/updater.js').execute(client, config);
        
        if (!config.leave.enabled) return;

        const guild = client.guilds.cache.get(config.guild);

        let channel;
		try {
			channel = member.dmChannel || await member.createDM();
		} catch (e) {
			channel = member.channel;
        }

        let welcomeChannel = client.channels.cache.get(config.welcome.channelId);
        let newInvite = await welcomeChannel.createInvite();
        let textMessage = config.leave.message
        .replace('{{ invite }}', newInvite);
        
        channel.send(textMessage)
    }
}