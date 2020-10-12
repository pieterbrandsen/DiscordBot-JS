const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const { MessageEmbed, DiscordAPIError } = require('discord.js');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.admin.announcement;
const commandText = commandObject.command;
const text = commandObject.text;
const returnText = commandObject.returnText;
const logText = commandObject.logText;

module.exports = {
    name: commandText.name,
    description: commandText.description,
    cooldown: commandText.cooldown,
    usage: commandText.usage,
	aliases: commandText.aliases,
	example: commandText.example,
    args: commandText.args,
    permission: commandText.permission,
    async execute(client, message, args, {config}) {
        const guild = message.guild;
        
        try {
            message.delete();
            message.channel.send(new MessageEmbed()
                .setColor(config.err_colour)
                .setTitle(text.embedTitle)
                .setDescription(`**${args.join(' ')}**`)
                .setFooter(config.serverName, guild.iconURL())
            );
            log.warn(logText.sentSuccesful
				.replace("{{ messageText }}", `\`${args.join(' ')}\``));
		} catch (error) {
            log.warn(logText.sentError
				.replace("{{ errorBlock }}", `\`${error.message}\``));
			log.error(error);
		}

    },
  };
  