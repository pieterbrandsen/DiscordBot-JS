const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const { MessageEmbed } = require('discord.js');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.basic.ip;
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
        const embed = new MessageEmbed()
        .setColor(config.colour)
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle(text.embedTitle
            .replace("{{ username }}", message.author.username)
            .replace("{{ messageContent }}", message.content)
            .replace("{{ serverName }}", config.serverName))
        .setDescription(text.embedDescription.replace("{{ ip }}", config.serverIp))
        .setFooter(config.serverName, guild.iconURL());

        message.delete({timeout: 15000});

        let channel;
        try {
            channel = message.author.dmChannel || await message.author.createDM();
            message.channel.send(returnText.sendInDm).then(msg => msg.delete({timeout: 15000}));
        } catch (e) {
            channel = message.channel;
        }

        let m = await channel.send(embed);
        m.delete({timeout: 600000*6}); // 60 Minuts
    }
  };
  