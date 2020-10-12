const { canModifyQueue } = require("../../modules/functions/IsInVoiceChannel");

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.music.volume;
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
  execute(client, message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply(returnText.nothingPlaying).catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply(returnText.notInVoiceChannel).catch(console.error);

    if (!args[0]) return message.reply(returnText.currentVolume.replace("{{ volume }}", queue.volume)).catch(console.error);
    if (isNaN(args[0])) return message.reply(returnText.isNaN).catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply(returnText.notInRange).catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(returnText.volumeChanged.replace("{{ volume }}", args[0])).catch(console.error);
  }
};
