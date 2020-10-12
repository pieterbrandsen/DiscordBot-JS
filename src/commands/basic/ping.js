const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.basic.ping;
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
    async execute(client, message, args) {
        message.channel.send(returnText.pinging).then(m =>{
            var ping = m.createdTimestamp - message.createdTimestamp;
            m.edit(returnText.pong.replace("{{ pongBlock }}", `\`${ping}ms\``));
        });
    },
  };
  