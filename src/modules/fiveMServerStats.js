const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const Discord = require('discord.js');
const config = require('../../user/config');
const fetchTimeout = require('fetch-timeout');

const USER_AGENT = `${config.name} ${require('../../package.json').version} , Node ${process.version} (${process.platform}${process.arch})`;

module.exports = {
    async execute(client) {
        const guild = client.guilds.cache.get(config.guild);


        const URL_SERVER = `http://${config.ip}`;
        const URL_PLAYERS = new URL('/players.json',`http://${config.ip}`).toString();
        const URL_INFO = new URL('/info.json',`http://${config.ip}`).toString();
        const MAX_PLAYERS = 64;
        const TICK_MAX = 1 << 9; // max bits for TICK_N
        const FETCH_TIMEOUT = 900;
        const FETCH_OPS = {
            'cache': 'no-cache',
            'method': 'GET',
            'headers': { 'User-Agent': USER_AGENT }
        };

        const CHANNEL_ID = config.serverStatsChannelId;
        const MESSAGE_ID = "763424550490341418";

        const SUGGESTION_CHANNEL = CHANNEL_ID;
        const BUG_CHANNEL = CHANNEL_ID;
        const BUG_LOG_CHANNEL = CHANNEL_ID;
        const LOG_CHANNEL = CHANNEL_ID;

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
                log.error('Loop callback called after timeout');
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
                log.debug('Update success');
            }).catch(() => {
                log.eror('Update failed');
            })
            } else {
                let channel = client.channels.cache.get(CHANNEL_ID);
                if (channel !== undefined) {
                    await channel.messages.fetch();
                    channel.messages.fetch(MESSAGE_ID).then((message) => {
                    MESSAGE = message;
                    message.edit(embed).then(() => {
                        log.info('Update success');
                    }).catch(() => {
                        log.error('Update failed');
                    });
                    }).catch(() => {
                    channel.send(embed).then((message) => {
                        MESSAGE = message;
                        log.info(`Sent message (${message.id})`);
                    }).catch(console.error);
                    })
                } else {
                    log.error('Update channel not set');
                }
            }
        };

        const UpdateEmbed = function() {
            let dot = TICK_N % 2 === 0 ? 'Groesbeek' : 'Roleplay';
            let embed = new Discord.MessageEmbed()
            .setAuthor(`${config.name} Server Status`, guild.iconURL())
            .setColor(config.colour)
            .setFooter(TICK_N % 2 === 0 ? `⚪ ${config.name}` : `⚫ ${config.name}`)
            .setTimestamp(new Date())
            .addField(`\n\u200b\nHoe kan je de server joinen?`,`Je kan de server joinen doormiddel van **${config.prefix}ip** te typen. Onderaan staat de server status om te kijken hoeveel mensen er online zijn en in de wachtrij staan\n\u200b\n`,false)
            if (STATUS !== undefined)
            {
            embed.addField(':warning: Actuele server status:',`${STATUS}\n\u200b\n`);
            embed.setColor(0xff5d00)
            }
            return embed;
        };

        const offline = function() {
            // log.info(Array.from(arguments));
            if (LAST_COUNT !== null) log.info(`Server offline ${URL_SERVER} (${URL_PLAYERS})`);
            let embed = UpdateEmbed()
            .setColor(0xff0000)
            .addField('Server Status',':x: Offline',true)
            .addField('Wachtrij','?',true)
            .addField('Online spelers','?\n\u200b\n',true);
            sendOrUpdate(embed);
            LAST_COUNT = null;
        };

        const updateMessage = function() {
            getVars().then((vars) => {
                getPlayers().then((players) => {
                    if (players.length !== LAST_COUNT) log.info(`${players.length} players`);
                    let queue = vars['Queue'];
                    let embed = UpdateEmbed()
                    .addField('Server Status',':white_check_mark: Online',true)
                    .addField('Wachtrij',queue === 'Enabled' || queue === undefined ? '0' : queue.split(':')[1].trim(),true)
                    .addField('Online spelers',`${players.length}/${MAX_PLAYERS}\n\u200b\n`,true);
                    // .addField('\u200b','\u200b\n\u200b\n',true);
                    if (players.length > 0) {
                    // method D
                    const fieldCount = 3;
                    const fields = new Array(fieldCount);
                    fields.fill('');
                    // for (var i=0;i<players.length;i++) {
                    //   fields[i%4 >= 2 ? 1 : 0] += `${players[i].name}${i % 2 === 0 ? '\u200e' : '\n\u200f'}`;
                    // }
                    fields[0] = `**Inwoners:**\n`;
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