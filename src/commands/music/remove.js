const { canModifyQueue } = require("../../modules/functions/IsInVoiceChannel");

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.music.remove;
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
    if (!queue) return message.channel.send(returnText.noQueue).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    
    if (isNaN(args[0])) return message.reply(returnText.usage);

    const song = queue.songs.splice(args[0] - 1, 1);
    if (song.length > 0)
    queue.textChannel.send(returnText.removedSong.replace("{{ author }}", message.author).replace("{{ songTitle }}", song[0].title));
    else 
    queue.textChannel.send(returnText.coudntFindSong);
  }
};
