const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const discord = require('discord.js');
const fs = require('fs');
const archive = require('../../modules/archive');

const languageConfig = require(`../../../user/languages/${require('../../../user/config').language}`);
const commandObject = languageConfig.commands.solicitation.apply;
const commandText = commandObject.command;
const text = commandObject.text;
const returnText = commandObject.returnText;
const logText = commandObject.logText;

module.exports = {
	name: commandText.name,
    description: commandText.description,
    cooldown: commandText.cooldown,
    usage: commandText.usage,
	aliases: commandText.aliases,
    example: commandText.example,
	args: commandText.args,
    permission: commandText.permission,
    async execute(client, message, args, {config, Solicitation}) {
        const guild = message.guild;

        let solicitations = await Solicitation.findAndCountAll({
			where: {
				creator: message.author.id,
				open: true
			},
			limit: config.apply.max
        });
        
        
		if (solicitations.count >= config.apply.max) {
			let solicitationsList = [];
			for (let t in solicitations.rows)  {
				let desc = solicitations.rows[t].job.substring(0, 30);
				solicitationsList
					.push(`${solicitations.rows[t].job}: ${solicitations.rows[t].id}\`\``);
			}		
			
			let m = await message.channel.send( 
				new discord.MessageEmbed()
					.setColor(config.err_colour)
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setTitle(returnText.maxCount.replace("{{ count }}", solicitations.count()))
					.setDescription(returnText.getHelpAt.replace("{{ ticketChannel }}", config.ticketCreateChannelId).replace("{{ solicationsList }}", solicitationsList.join(',\n')))
					.setFooter(text.thisMessageDelete.replace("{{ guildName }}", config.serverName), guild.iconURL())
			);

			return setTimeout(async () => {
				await message.delete();
				await m.delete();
			}, 15000);
        }
        

        const questions = text.questions[args[0]] || [];
        if (questions.length == 0) 
        return message.channel.send(new discord.MessageEmbed().setTitle(returnText.wrongArgs).setDescription(`**${config.prefix}${this.name}** ${Object.keys(text.questions).join(`\n**!soli** `)}`));

        try {
            message.channel.send(text.sentInDm).then(msg => msg.delete({timeout: 15000}));
        } catch (error) {
            log.info(logText.applyError.replace("{{ username }}", message.user.username));
            log.error(error);
        } 

        let id = solicitations.count+1;
        const dmChannel = await message.author.send(new discord.MessageEmbed().setTitle(text.applyWelcomeMessage.replace("{{ jobTitle }}", args[0]))
        .setDescription(`Vraag 1: ${questions[0]}`)
        .setColor(config.colour));
        const filter = m => m.content.includes('discord');
        const collector = dmChannel.channel.createMessageCollector((msg) => msg.author.id == message.author.id, { time: 600000 });
        const res = [];
        let i = 0;

        await Solicitation.create({
            creator: message.author.id,
            job: args[0],
			open: true,
			archived: false,
		});

        collector.on('collect', async(msg) => {
            archive.add(msg, "solicitation", id)
            if (questions.length == i) return collector.stop('MAX');
            const answer = msg.content;
            res.push({question: questions[i], answer});
            i++;

            if (questions.length == i || msg == text.stopCommand.replace("{{ prefix }}", config.prefix)) return collector.stop('MAX');
            else {
                returnMessage = dmChannel.channel.send(new discord.MessageEmbed().setTitle(text.fullQuestion.replace("{{ questionNumber }}", i+1).replace("{{ questionText }}", questions[i])).setColor(config.colour));
                archive.add(returnMessage, "solicitation", id);
            }
        });

        let data = "";
        collector.on('end', (collected, reason) => {
            if (reason == 'MAX') {
                const test = Solicitation.update({
                    open: false
                }, {
                    where: {
                        creator: message.author.id
                    }
                });

                data = message.guild.channels.cache.get(config.logs.discord.channel);
                data.send(`${returnText.completedSolicitation.replace("{{ author }}", message.member || message.author).replace("{{ authorTag }}", message.author.tag)}\n${res.map(d => text.question.replace("{{ question }}", d.question).replace("{{ answer }}", d.answer)).join("\n")}`);
                message.author.send(new discord.MessageEmbed()
                .setTitle(returnText.succesfullySendTitle)
                .setDescription(returnText.succesfullySendDescription)
                .setColor(config.colour));
            }
            else if (reason == "time") {
                const test = Solicitation.update({
                    open: false
                }, {
                    where: {
                        creator: message.author.id
                    }
                });

                data = message.guild.channels.cache.get(config.logs.discord.channel);
                data.send(`${returnText.failedSolicitation.replace("{{ author }}", message.member || message.author).replace("{{ authorTag }}", message.author.tag)}\n${res.map(d => text.question.replace("{{ question }}", d.question).replace("{{ answer }}", d.answer)).join("\n")}`);
                message.author.send(new discord.MessageEmbed()
                .setTitle(returnText.timedOutTitle)
                .setDescription(returnText.timedOutDescription)
                .setColor(config.colour));
            }
        });  
    }
}