const { downloadDir } = require("../config/download");
const fs = require("fs");

let lastPlayTime = 0;
const playCooldown = 1000 * 15;

module.exports = ({ command, message, client }) => {
  let [name] = command.args;

  if (!name) {
    client.chat.say(message.channel, `Usage: !play <name>`);
    return;
  }

  const fileList = fs.readdirSync(downloadDir);

  if (name === "-h") {
    const playlist = fileList.map((f) => f.slice(0, -4)).join(" | ");
    client.chat.say(message.channel, `Playlist: ${playlist}`);
    return;
  }

  const matchFile = fileList.find((file) => file.slice(0, -4) === name);

  if (!matchFile) {
    client.chat.say(message.channel, `Aucun fichier trouvé pour ${name}...`);
    return;
  }

  const elapsed = message.data.timestamp - lastPlayTime;

  if (elapsed < playCooldown) {
    const rest = parseInt((playCooldown - elapsed) / 1000);
    client.chat.say(message.channel, `!play cooldown (~${rest}s)`);
    return;
  }

  lastPlayTime = message.data.timestamp;
  client.io.emit("play.sound", { file: matchFile });
};
