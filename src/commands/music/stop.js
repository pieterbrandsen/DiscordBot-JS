const { canModifyQueue } = require("../../modules/functions/IsInVoiceChannel");

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.music.stop;
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
  execute(client, message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply(returnText.nothingPlaying).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(returnText.stopped.replace("{{ author }}", message.author)).catch(console.error);
  }
};
