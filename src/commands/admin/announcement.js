const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const { MessageEmbed, DiscordAPIError } = require('discord.js');

module.exports = {
    name: 'announcement',
    description: 'Stuur een embed announcement naar de server met jouw text.',
    cooldown: 120,
    usage: '',
	aliases: ['anno', 'announce', 'mededelingen'],
	example: 'announcement',
    args: true,
    permission: 'MANAGE_CHANNELS',
    async execute(client, message, args, {config}) {
        const guild = message.guild;

        message.delete();
        message.channel.send(new MessageEmbed()
            .setColor(config.err_colour)
            .setTitle(':warning: **Mededeling** :warning:')
            .setDescription(`**${args[0]}**`)
            .setFooter(guild.name, guild.iconURL())
        );
    },
  };
  