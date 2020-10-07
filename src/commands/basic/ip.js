const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ip',
    description: 'Stuurt het IP naar de server',
    cooldown: 5,
    usage: '',
	aliases: ['connect'],
	example: 'ip',
	args: false,
    async execute(client, message, args, {config}) {
        // Connect ${config.ip}
        const guild = client.guilds.cache.get(config.guild);
        const embed = new MessageEmbed()
        .setColor(config.colour)
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle(`**Hallo ${message.author.username}, je had !ip gedaan om te connecten met ${config.name}**`)
        .setDescription(`

        Volg deze stappen om te connecten!

        Stap 1: Open FiveM
        Stap 2: Druk F8 -> **KOMT BINNENKORT**
        
        **Veel Plezier in onze Stad!**`)
        .setFooter(guild.name, guild.iconURL())

        message.delete({timeout: 15000});

        let channel;
        try {
            channel = message.author.dmChannel || await message.author.createDM();
            message.channel.send('Verstuurt in DM').then(msg => msg.delete({timeout: 15000}));
        } catch (e) {
            channel = message.channel;
        }

        let m = await channel.send(embed);
        m.delete({timeout: 600000*6}); // 60 Minuts
    }
  };
  