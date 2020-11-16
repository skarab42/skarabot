const envPaths = require("env-paths");
const path = require("path");
const fs = require("fs");

const userDir = envPaths("marv").data;
const songFile = path.join(userDir, "files/lorem.txt");

module.exports = ({ message, client }) => {
  const title = fs.readFileSync(songFile);

  client.chat.say(
    message.channel,
    `Vous écoutez "${title}" disponible sur YouTube.`
  );
};
