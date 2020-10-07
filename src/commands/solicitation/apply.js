const ChildLogger = require('leekslazylogger').ChildLogger;
const log = new ChildLogger();

const discord = require('discord.js');
const fs = require('fs');
const { Solicitation } = require('opusscript');
const archive = require('../../modules/archive');

const config = require(`../../../user/languages/${require('../../../user/config').language}`);

module.exports = {
    name: 'soli',
	description: 'Maak een nieuwe solicitatie aan',
	usage: '[solicitatieBaan]',
	aliases: ['solicitatie', 'apply'],
	example: 'soli politie',
    args: true,
    async execute(client, message, args, {Solicitation}) {
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
					.setTitle(`:x: **Je hebt al ${solicitations.count} of meer open applicaties**`)
					.setDescription(`Vraag een admin om applicaties te sluiten in <#${config.ticketCreateChannelId}>.\n\n${solicitationsList.join(',\n')}`)
					.setFooter(guild.name + ' | Dit bericht wordt verwijderd in 15 seconden', guild.iconURL())
			);

			return setTimeout(async () => {
				await message.delete();
				await m.delete();
			}, 15000);
        }
        

        const questions = config.apply.questions[args[0]] || [];
        if (questions.length == 0) 
        return message.channel.send(new discord.MessageEmbed().setTitle(config.apply.wrongArgs).setDescription(`**!soli** ${Object.keys(config.apply.questions).join(`\n**!soli** `)}`));

        try {
            message.channel.send('Verstuurt in DM').then(msg => msg.delete({timeout: 15000}));
        } catch (error) {
            log.info(`There was an error for user ${message.user.username} when applying.`);
            log.error(error);
        } 

        let id = solicitations.count+1;
        const dmChannel = await message.author.send(new discord.MessageEmbed().setTitle(config.apply.applyWelcomeMessage).setDescription(`Vraag 1: ${questions[0]}`).setColor(config.colour));
        const filter = m => m.content.includes('discord');
        const collector = dmChannel.channel.createMessageCollector((msg) => msg.author.id == message.author.id, { time: 600000 });
        const res = [];
        let i = 0;

        const test2 = await Solicitation.create({
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

            if (questions.length == i || msg == `${config.prefix}stop`) return collector.stop('MAX');
            else {
                dmChannel.channel.send(new discord.MessageEmbed().setTitle(`Vraag ${i+1}: ${questions[i]}`).setColor(config.colour));
                //archive.add(returnMessage, "solicitation", id);
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
                data.send(`${message.member || message.author} (${message.author.tag}) heeft gesoliciteerd,\n${res.map(d => `Vraag ${d.question}: ${d.answer}`).join("\n")}`);
                message.author.send(new discord.MessageEmbed().setTitle(config.apply.succesfullySendTitle).setDescription(config.apply.succesfullySendDescription).setColor(config.colour));
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
                data.send(`${message.member || message.author} (${message.author.tag}) Heeft gesoliciteerd maar was niet op tijd met vragen beantwoorden,\n${res.map(d => `Vraag ${d.question}: ${d.answer}`).join("\n")}`);
                message.author.send(new discord.MessageEmbed().setTitle(config.apply.timedOutTitle).setDescription(config.apply.timedOutDescription).setColor(config.colour));
            }
        });  
    }
}