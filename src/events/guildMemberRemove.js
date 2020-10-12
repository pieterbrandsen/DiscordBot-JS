const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);
const eventObject = languageConfig.events.guildMemberRemove;
const text = eventObject.text;
const returnText = eventObject.returnText;
const logText = eventObject.logText;

module.exports = {
    event: 'guildMemberRemove',
    async execute(client, [member], {config}) {
        log.info(logText.userLeft.replace("{{ username }}", member.user.username).replace("{{ guildName }}", config.serverName));
        require('../modules/updater.js').execute(client, config);
        
        if (!config.leave.enabled) return;

        const guild = member.guild;

        let channel;
		try {
			channel = member.dmChannel || await member.createDM();
		} catch (e) {
			channel = member.channel;
        }

        let welcomeChannel = client.channels.cache.get(config.welcome.channelId);
        let newInvite = await welcomeChannel.createInvite();
        let textMessage = text.leaveMessage
        .replace('{{ invite }}', newInvite);
        
        channel.send(textMessage)
    }
}