const fs = require("fs");
const config = require("../../../user/config");

module.exports = {
  name: "pruning",
  description: "Toggle pruning of bot messages",
  execute(client, message) {
    config.PRUNING = !config.music.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("There was an error writing to the file.").catch(console.error);
      }

      return message.channel
        .send(`Message pruning is ${config.music.PRUNING ? "**enabled**" : "**disabled**"}`)
        .catch(console.error);
    });
  }
};
