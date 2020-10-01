const { MessageAttachment, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();


const Canvas = require('canvas');

// Pass the entire Canvas object because you'll need to access its width, as well its context
const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};

module.exports = {
    event: 'guildMemberAdd',
    async execute(client, [member], {config}) {
        if (!config.welcome.enabled) return;

		const guild = client.guilds.cache.get(config.guild);
        log.info(`New User "${member.user.username}" has joined "${member.guild.name}"` );

        if (member.user.bot) return;

        let DMMessage = config.welcome.DMMessage
        .replace('{{ tag }}', member)
        .replace('{{ guild }}', guild)
        .replace('{{ announcements }}', client.channels.cache.get(config.announcementsChannelId))
        .replace('{{ general }}', client.channels.cache.get(config.generalChannelId))
        .replace('{{ ticketChannel }}', client.channels.cache.get(config.ticketCreateChannelId))
        .replace('{{ guild }}', guild);
        let textMessageNumber = Math.floor(Math.random() * Math.floor(config.welcome.message.length));
        let textMessage = config.welcome.message[textMessageNumber]
        .replace('{{ tag }}', member);


		let channel;
		try {
			channel = member.dmChannel || await member.createDM();
		} catch (e) {
			channel = member.channel;
        }


        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
    
        const background = await Canvas.loadImage('./wallpaper.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
        // Slightly smaller text placed above the member's display name
        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Welkom op de server,', canvas.width / 2.5, canvas.height / 3.5);
    
        // Add an exclamation point here and below
        ctx.font = applyText(canvas, `${member.displayName}!`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);
    
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
    
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);

    
        const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        let m = await channel.send(DMMessage);
        m.delete({timeout: 60000});

        member.guild.channels.cache.get(config.welcome.channelId).send(
            textMessage,
            attachment
        );
    } 
}