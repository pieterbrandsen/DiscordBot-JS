const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.music.lyrics;
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
  async execute(client, message, args, {config}) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(returnText.nothingPlaying).catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = returnText.nothingFound.replace("{{ songTitle }}", queue.songs[0].title);
    } catch (error) {
      lyrics = returnText.nothingFound.replace("{{ songTitle }}", queue.songs[0].title);
    }

    let lyricsEmbed = new MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())   
    .setTitle(text.embedTitle)
    .setColor(config.colour)
      .setDescription(lyrics)
      .setFooter(config.serverName, message.channel.guild.iconURL());

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};
