const { downloadDir } = require("../config/download");
const fs = require("fs");

const cooldownTimeout = 15;

module.exports = ({ command, message, client, cooldown }) => {
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

  if (cooldown("cmd.play", cooldownTimeout)) return;

  client.io.emit("play.sound", { file: matchFile });
};
