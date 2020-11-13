const { downloadDir } = require("../config/download");
const fs = require("fs");

let lastPlayTime = 0;
const playCooldown = 1000 * 60;

module.exports = ({ command, message, client }) => {
  let [name] = command.args;

  if (!name) {
    client.chat.say(message.channel, `Usage: !play <name>`);
    return;
  }

  const elapsed = message.data.timestamp - lastPlayTime;

  let extactMatch = null;
  let partialMatch = [];

  fs.readdirSync(downloadDir).forEach((file) => {
    if (file === name) {
      extactMatch = file;
    } else if (file.match(new RegExp(`${name}.[a-z0-9]{3}`))) {
      partialMatch.push(file);
    }
  });

  const matchFile = extactMatch || partialMatch[0];

  if (!matchFile) {
    client.chat.say(message.channel, `Aucun fichier trouvé pour ${name}...`);
    return;
  }

  if (elapsed < playCooldown) {
    const rest = parseInt((playCooldown - elapsed) / 1000);
    client.chat.say(message.channel, `!play cooldown (~${rest}s)`);
    return;
  }

  lastPlayTime = message.data.timestamp;
  client.io.emit("play.sound", { file: matchFile });
};
