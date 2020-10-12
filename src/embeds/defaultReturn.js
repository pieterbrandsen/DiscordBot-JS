const embed = new MessageEmbed()
.setColor(config.colour)
.setAuthor(message.author.username, message.author.displayAvatarURL())
.setTitle(`**Hallo ${message.author.username}, je had !ip gedaan om te connecten met ${config.name}**`)
.setDescription(`

Volg deze stappen om te connecten!

Stap 1: Open FiveM
Stap 2: Druk F8 -> **KOMT BINNENKORT**

**Veel Plezier in onze Stad!**`)
.setFooter(config.serverName, guild.iconURL());