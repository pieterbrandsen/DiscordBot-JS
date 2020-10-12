const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const Discord = require('discord.js');
const config = require('../../user/config');
const fetchTimeout = require('fetch-timeout');

const USER_AGENT = `${config.name} ${require('../../package.json').version} , Node ${process.version} (${process.platform}${process.arch})`;

const languageConfig = require(`../../user/languages/${require('../../user/config').language}`);
const moduleObject = languageConfig.modules.fiveMServerPlayers;
const text = moduleObject.text;
const returnText = moduleObject.returnText;
const logText = moduleObject.logText;

module.exports = {
    async execute(client) {
        if (!config.serverPlayers.enabled) return;

        const guild = client.guilds.cache.get(config.guildId);


        const URL_SERVER = `http://${config.serverIp}`;
        const URL_PLAYERS = new URL('/players.json',`http://${config.serverIp}`).toString();
        const URL_INFO = new URL('/info.json',`http://${config.serverIp}`).toString();
        const MAX_PLAYERS = 64;
        const TICK_MAX = 1 << 9; // max bits for TICK_N
        const FETCH_TIMEOUT = 900;
        const FETCH_OPS = {
            'cache': 'no-cache',
            'method': 'GET',
            'headers': { 'User-Agent': USER_AGENT }
        };

        const CHANNEL_ID = config.serverPlayersChannelId;
        const MESSAGE_ID = config.serverPlayersMessageId;

        var TICK_N = 0;
        var MESSAGE;
        var LAST_COUNT;
        var STATUS;

        var loop_callbacks = []; // for testing whether loop is still running

        function checkLoop() {
            return new Promise((resolve,reject) => {
            var resolved = false;
            let id = loop_callbacks.push(() => {
                if (!resolved) {
                resolved = true;
                resolve(true);
                } else {
                log.error(logText.loopCallback);
                reject(null);
                }
            })
            setTimeout(() => {
                if (!resolved) {
                resolved = true;
                resolve(false);
                }
            },3000);
            })
        }

        const getPlayers = function() {
            return new Promise((resolve,reject) => {
            fetchTimeout(URL_PLAYERS,FETCH_OPS,FETCH_TIMEOUT).then((res) => {
                res.json().then((players) => {
                resolve(players);
                }).catch(reject);
            }).catch(reject);
            })
        };

        const getVars = function() {
            return new Promise((resolve,reject) => {
              fetchTimeout(URL_INFO,FETCH_OPS,FETCH_TIMEOUT).then((res) => {
                res.json().then((info) => {
                  resolve(info.vars);
                }).catch(reject);
              }).catch(reject);
            });
          };

        const sendOrUpdate = async function(embed) {
            if (MESSAGE !== undefined) {
            MESSAGE.edit(embed).then(() => {
                log.debug(logText.updateSucces);
            }).catch(() => {
                log.eror(logText.updateFailed);
            })
            } else {
                let channel = client.channels.cache.get(CHANNEL_ID);
                if (channel !== undefined) {
                    await channel.messages.fetch();
                    channel.messages.fetch(MESSAGE_ID).then((message) => {
                    MESSAGE = message;
                    message.edit(embed).then(() => {
                        log.info(logText.updateSucces);
                    }).catch(() => {
                        log.error(logText.updateFailed);
                    });
                    }).catch(() => {
                    channel.send(embed).then((message) => {
                        MESSAGE = message;
                        log.info(logText.sentNewMessage.replace("{{ messageId }}", message.id));
                    }).catch(console.error);
                    })
                } else {
                    log.error(logText.noUpdateChannel);
                }
            }
        };

        const UpdateEmbed = function() {
            let dot = TICK_N % 2 === 0 ? config.serverName : config.serverName;
            let embed = new Discord.MessageEmbed()
            .setAuthor(returnText.updateEmbedTitle.replace("{{ serverName }}", config.serverName), guild.iconURL())
            .setColor(config.colour)
            .setFooter(TICK_N % 2 === 0 ? `⚪ ${config.serverName}` : `⚫ ${config.serverName}`)
            .setTimestamp(new Date())
            .addField(returnText.updateEmbedFields[0], returnText.updateEmbedFields[1].replace("{{ prefix }}", config.prefix),false)
            if (STATUS !== undefined)
            {
            embed.addField(returnText.updateEmbedFields[2],`${STATUS}\n\u200b\n`);
            embed.setColor(0xff5d00)
            }
            return embed;
        };

        const offline = function() {
            // log.info(Array.from(arguments));
            if (LAST_COUNT !== null) log.info(`${logText.serverOffline} ${URL_SERVER} (${URL_PLAYERS})`);
            let embed = UpdateEmbed()
            .setColor(0xff0000)
            .addField(returnText.offlineEmbedTitle[0],returnText.offlineEmbedTitle[1],true)
            .addField(returnText.offlineEmbedTitle[2],returnText.offlineEmbedTitle[3],true)
            .addField(returnText.offlineEmbedTitle[4],returnText.offlineEmbedTitle[5],true);
            sendOrUpdate(embed);
            LAST_COUNT = null;
        };

        const updateMessage = function() {
            getVars().then((vars) => {
                getPlayers().then((players) => {
                    if (players.length !== LAST_COUNT) log.info(logText.playerCount.replace("{{ playerCount }}", players.length));
                    let queue = vars['Queue'];
                    let embed = UpdateEmbed()
                    .addField(returnText.updateMessageEmbedFields[0],returnText.updateMessageEmbedFields[1],true)
                    .addField(returnText.updateMessageEmbedFields[2],queue === 'Enabled' || queue === undefined ? '0' : queue.split(':')[1].trim(),true)
                    .addField(returnText.updateMessageEmbedFields[3],`${players.length}/${MAX_PLAYERS}\n\u200b\n`,true);
                    // .addField('\u200b','\u200b\n\u200b\n',true);
                    if (players.length > 0) {
                    // method D
                    const fieldCount = 3;
                    const fields = new Array(fieldCount);
                    fields.fill('');
                    // for (var i=0;i<players.length;i++) {
                    //   fields[i%4 >= 2 ? 1 : 0] += `${players[i].name}${i % 2 === 0 ? '\u200e' : '\n\u200f'}`;
                    // }
                    fields[0] = text.usersname;
                    for (var i=0;i<players.length;i++) {
                        fields[(i+1)%fieldCount] += `${players[i].name.substr(0,12)}\n`; // first 12 characters of players name
                    }
                    for (var i=0;i<fields.length;i++) {
                        let field = fields[i];
                        if (field.length > 0) embed.addField('\u200b',field,true);
                    }

                    // method A
                    // let maxLen = 8;
                    // var text = '';
                    // for (var i=0;i<players.length;i++) {
                    //   var eol = false;
                    //   if ((i+1) % 3 === 0) eol = true;
                    //   text += paddedFullWidth(players[i].name,eol ? players[i].name.length : maxLen);
                    //   if (eol) text += '\n';
                    // }
                    // embed.addField('Spelers',`**${text}**`,false);

                    // method B
                    // embed.addField('Spelers','\u200b',false);
                    // for (var player of players) {
                    //   embed.addField('\u200b',player.name,true);
                    // }
                    // for (var i=0;i<3-(players.length%3);i++) {
                    //   embed.addField('\u200b','\u200b',false);
                    // }

                    // method C
                    // let playerNames = Array.from(players.values()).map((c) => `**${c.name}**`).join(', ');
                    // embed.addField('Spelers',playerNames,false);
                    }
                    sendOrUpdate(embed);
                    LAST_COUNT = players.length;
                }).catch(offline);
            }).catch(offline);
            TICK_N++;
            if (TICK_N >= TICK_MAX) {
            TICK_N = 0;
            }
            for (var i=0;i<loop_callbacks.length;i++) {
            let callback = loop_callbacks.pop(0);
            callback();
            }
        }

        updateMessage();
    }
}