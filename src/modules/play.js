const ytdlDiscord = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader");
const { canModifyQueue } = require("../modules/functions/IsInVoiceChannel");

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);
const moduleObject = languageConfig.modules.play;
const text = moduleObject.text;
const returnText = moduleObject.returnText;
const logText = moduleObject.logText;

module.exports = {
  async play(song, message) {
    const { music } = require("../../user/config");
    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      return queue.textChannel.send(text.queueEnded).catch(console.error);
    }

    let stream = null;

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com") && music.SOUNDCLOUD_CLIENT_ID) {
        const info = await scdl.getInfo(song.url, music.SOUNDCLOUD_CLIENT_ID);
        const opus = scdl.filterMedia(info.media.transcodings, { format: scdl.FORMATS.OPUS });
        stream = await scdl.downloadFromURL(opus[0].url, music.SOUNDCLOUD_CLIENT_ID);
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const type = song.url.includes("youtube.com") ? "opus" : "ogg/opus";
    const dispatcher = queue.connection
      .play(stream, { type: type })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      var playingMessage = await queue.textChannel.send(text.startedPlaying.replace("{{ songTitle }}", song.title).replace("{{ songUrl }}", song.url));
      await playingMessage.react(text.playingReactions[0]);
      await playingMessage.react(text.playingReactions[1]);
      await playingMessage.react(text.playingReactions[2]);
      await playingMessage.react(text.playingReactions[3]);
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          queue.textChannel.send(text.userSkippedSong.replace("{{ user }}", user)).catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(text.userPausedSong.replace("{{ user }}", user)).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(text.userResumedSong.replace("{{ user }}", user)).catch(console.error);
          }
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          queue.textChannel.send(`${text.loopIsNow[0]} ${queue.loop ? text.loopIsNow[1] : text.loopIsNow[2]}`).catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          queue.textChannel.send(text.userStoppedSong.replace("{{ user }}", user)).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (music.PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
