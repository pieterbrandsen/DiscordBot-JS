const { MessageEmbed } = require("discord.js");

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.music.nowPlaying;
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
  execute(client, message, args, {config}) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(returnText.nothingPlaying).catch(console.error);
    const song = queue.songs[0];

    let nowPlaying = new MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())   
    .setTitle(text.embedTitle)
      .setDescription(`${song.title}\n${song.url}`)
      .setColor(config.colour)
      .setFooter(config.serverName, message.guild.iconURL());

    if (song.duration > 0) nowPlaying.setFooter(new Date(song.duration * 1000).toISOString().substr(11, 8));

    return message.channel.send(nowPlaying);
  }
};
