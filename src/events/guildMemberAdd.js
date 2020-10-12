const Canvas = require('canvas');

const { MessageAttachment, MessageEmbed } = require('discord.js');
const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);
const eventObject = languageConfig.events.guildMemberAdd;
const text = eventObject.text;
const returnText = eventObject.returnText;
const logText = eventObject.logText;


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
        log.info(logText.newUserJoined.replace("{{ username }}", member.user.username).replace("{{ guildName }}", member.config.serverName));
        //require('../modules/updater.js').execute(client, config);

        if (!config.welcome.enabled) return;

		const guild = member.guild;


        if (member.user.bot) return;

        const DmMessageTitle = returnText.DmMessageTitle.replace('{{ username }}', member.user.username);
        const DmMessageDescription = returnText.DmMessageDescription.replace('{{ serverName }}', config.serverName);
        const DmMessageFooter = returnText.DmMessageFooter.replace('{{ serverName }}', config.serverName);


        let DmMessageEmbed = new MessageEmbed();
        DmMessageEmbed.setColor(config.colour)
        DmMessageEmbed.setTitle(DmMessageTitle);
        DmMessageEmbed.setDescription(DmMessageDescription);
        DmMessageEmbed.setFooter(DmMessageFooter);

        for (let i = 0; i < returnText.DMMessageFields.length; i++) {
            const description = returnText.DMMessageFields[i]
            const link = returnText.DMMessageFieldLinks[i]
            .replace('{{ announcements }}', client.channels.cache.get(config.announcementsChannelId))
            .replace('{{ general }}', client.channels.cache.get(config.generalChannelId))
            .replace('{{ ticketChannel }}', client.channels.cache.get(config.ticketCreateChannelId));

            DmMessageEmbed.addField(description, link, true);
        }
        let textMessageNumber = Math.floor(Math.random() * Math.floor(text.welcomeMessage.length));
        let textMessage = text.welcomeMessage[textMessageNumber]
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
        ctx.fillText(text.welcomeToServer, canvas.width / 2.5, canvas.height / 3.5);
    
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

        let m = await channel.send(DmMessageEmbed);
        m.delete({timeout: 360000});

        member.guild.channels.cache.get(config.welcome.channelId).send(
            textMessage,
            attachment
        );
    } 
}