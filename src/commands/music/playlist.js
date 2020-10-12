const { MessageEmbed } = require("discord.js");
const { play } = require("../../modules/play");
const { music } = require("../../../user/config");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(music.YOUTUBE_API_KEY);

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.music.playlist;
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
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(returnText.wrongVoiceChannel).catch(console.error);

    if (!channel) return message.reply(returnText.notInVoiceChannel).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply(returnText.missingConnectPerm);
    if (!permissions.has("SPEAK"))
      return message.reply(returnText.missingSpeakPerm);

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let song = null;
    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(music.MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(returnText.couldNotFindPlayList).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(music.MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(returnText.couldNotFindPlayList).catch(console.error);
      }
    }

    videos.forEach((video) => {
      song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      };

      if (serverQueue) {
        serverQueue.songs.push(song);
          message.channel
            .send(returnText.addedToQueue.replace("{{ songTitle }}", song.title).replace("{{ author }}", message.author))
            .catch(console.error);
      } else {
        queueConstruct.songs.push(song);
      }
    });

    let playlistEmbed = new MessageEmbed()
      .setTitle(`${playlist.title}`)
      .setURL(playlist.url)
      .setColor(config.colour)
      .setFooter(config.serverName, message.guild.iconURL());

      playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
      if (playlistEmbed.description.length >= 2048)
        playlistEmbed.description = returnText.playlistIsTooLong.replace("{{ embedDescription }}", playlistEmbed.description.substr(0, 1900));

    message.channel.send(returnText.startedPlaylist.replace("{{ author }}", message.author), playlistEmbed);

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!serverQueue) {
      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(returnText.missingConnectPerm).catch(console.error);
      }
    }
  }
};
