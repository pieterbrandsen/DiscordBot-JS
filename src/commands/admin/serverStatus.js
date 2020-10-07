// let status = message.content.substr(7).trim();
// let embed =  new Discord.RichEmbed()
// .setAuthor(message.member.nickname ? message.member.nickname : message.author.tag,message.author.displayAvatarURL)
// .setColor(0x2894C2)
// .setTitle('Updated status message')
// .setTimestamp(new Date());
// if (status === 'clear') {
//   STATUS = undefined;
//   embed.setDescription('Cleared status message');
// } else {
//   STATUS = status;
//   embed.setDescription(`New message:\n\`\`\`${STATUS}\`\`\``);
// }
// bot.channels.get(LOG_CHANNEL).send(embed);
// return log(LOG_LEVELS.INFO,`${message.author.username} updated status`);