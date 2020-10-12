const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const { MessageEmbed } = require('discord.js');
const { replace } = require('ffmpeg-static');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.basic.suggestion;
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
        if (config.suggestionChannelId.indexOf(message.channel.id) != -1) {
            const embed = new MessageEmbed()
                .setColor(config.colour)
                .setAuthor(message.member.nickname ? message.member.nickname : message.author.tag,message.author.displayAvatarURL())
                .setTitle(text.embedTitle)
                .setDescription(args.join(' '));
            try {
                const sendMessage = await message.channel.send(embed);
                sendMessage.react(text.thumbsUp)
                    .then(() => sendMessage.react(text.thumbsDown));
                message.delete({ timeout: 15000 });
            }
            catch (error) {
                log.warn(logText.sendError);
                log.error(error);
            }
        }
        else {
            const m = await message.channel.send(
				new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(returnText.embedTitle)
					.setDescription(returnText.embedDescription.replace("{{ firstSuggestionChannel }}", config.suggestionChannelId[0]))
					.setFooter(returnText.embedFooter.replace("{{ botUsername }}", client.user.username), client.user.avatarURL())
			);

            setTimeout(async () => {
                await message.delete();
				await m.delete();
            }, 15000);
        }
    },
};
