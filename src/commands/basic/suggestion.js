const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'suggestie',
    description: 'Stuur een suggestie voor de server in het suggestie kanaal.',
    cooldown: 60,
    usage: '<tekst>',
    aliases: ['suggestion'],
    example: `Meer auto\'s voor iedereen!`,
    args: false,
    async execute(client, message, args, { config }) {

        if (config.suggestionChannelId.indexOf(config.suggestionChannelId) == -1) {
            const Discord = require('discord.js');
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(args)
                .setFooter(`Suggestie van ${message.author.username}`);

            try {
                const sendMessage = await message.channel.send(embed);
                sendMessage.react('✅')
                    .then(() => sendMessage.react('❌'));
                message.delete({ timeout: 15000 });

            }
            catch (error) {
                log.warn('Could not react to suggestion or send suggestion');
                log.error(error);
            }
        }
        else {
            const m = await message.channel.send(
				new MessageEmbed()
					.setColor(config.colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(':x: **Verkeerd kanaal**')
					.setDescription(`Verstuur je suggestie alsjeblieft in een suggestie kanaal`)
					.setFooter(client.user.username + ' | Dit bericht wordt in 15 seconden verwijderd', client.user.avatarURL())
			);

            setTimeout(async () => {
                await message.delete();
				await m.delete();
			}, 15000);
        }
    },
};
