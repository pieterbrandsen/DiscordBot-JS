

const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const fs = require('fs');

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);
const eventObject = languageConfig.events.messageDelete;
const text = eventObject.text;
const returnText = eventObject.returnText;
const logText = eventObject.logText;

module.exports = {
	event: 'messageDelete',
	async execute(client, [message], {config, Ticket}) {

		if(!config.transcripts.web.enabled) return;

		if (message.partial) 
			try {
				await message.fetch();
			} catch (err) {
				log.warn(logText.cantFetch);
				log.error(err.message);
				return;
			}

		let ticket = await Ticket.findOne({ where: { channel: message.channel.id } });
		if(!ticket) return;
		

		let path = `user/transcripts/raw/${message.channel.id}.log`;
		let embeds = [];
		for (let embed in message.embeds)
			embeds.push(message.embeds[embed].toJSON());

		fs.appendFileSync(path, JSON.stringify({
			id: message.id,
			author: message.author.id,
			content: message.content, // do not use cleanContent!
			time: message.createdTimestamp,
			embeds: embeds,
			attachments: [...message.attachments.values()],
			edited: message.edits.length > 1,
			deleted: true // delete the message
		}) + '\n');

	}
};