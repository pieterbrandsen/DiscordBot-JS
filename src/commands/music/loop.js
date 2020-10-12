const { canModifyQueue } = require("../../modules/functions/IsInVoiceChannel");

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.music.loop;
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

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(returnText.loopIs.replace("{{ on/off }}", queue.loop ? returnText.on : returnText.off))
      .catch(console.error);
  }
};
