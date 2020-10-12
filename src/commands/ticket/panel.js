

const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();
const { MessageEmbed } = require('discord.js');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.ticket.panel;
const commandText = commandObject.command;
const text = commandObject.text;
const returnText = commandObject.returnText;
const logText = commandObject.logText;

module.exports = {
	name: commandText.name,
	description: commandText.description,
	usage: commandText.usage,
	aliases: commandText.aliases,
	example: commandText.example,
	args: commandText.args,
	permission: commandText.permission,
	async execute(client, message, args, {config, Setting}) {

		const guild = client.guilds.cache.get(config.guildId);

		let msgID = await Setting.findOne({ where: { key: 'panel_msg_id' } });
		let chanID = await Setting.findOne({ where: { key: 'panel_chan_id' } });
		let panel;

		if(!chanID) 
			chanID = await Setting.create({
				key: 'panel_chan_id',
				value: message.channel.id,
			});

		if(!msgID) {
			msgID = await Setting.create({
				key: 'panel_msg_id',
				value: '',
			});
		} else {
			try {
				panel = await client.channels.cache.get(chanID.get('value')).messages.fetch(msgID.get('value')); // get old panel message
				if (panel)
					panel.delete({ reason: text.newPanel }).then(() => log.info(logText.deletedOldPanel)).catch(e => log.warn(e)); // delete old panel
			} catch (e) {
				log.warn('Couldn\'t delete old panel');
			}
			
		}

		message.delete();

		panel = await message.channel.send(
			new MessageEmbed()
				.setColor(config.colour)
				.setTitle(text.newPanelEmbedTitle)
				.setDescription(text.newPanelEmbedDescription)
				.setFooter(config.serverName, guild.iconURL())
		); // send new panel

		let emoji = panel.guild.emojis.cache.get(config.tickets.panelReaction) || config.tickets.panelReaction;
		panel.react(emoji); // add reaction
		Setting.update({ value: message.channel.id }, { where: { key: 'panel_chan_id' }}); // update database
		Setting.update({ value: panel.id }, { where: { key: 'panel_msg_id' }}); // update database

		log.info(logText.createdNewPanel.replace("{{ authorTag }}", message.author.tag));
	}
};