const { downloadDir, allowedExtensions } = require("../config/download");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = ({ command, message, client, isModo }) => {
  let [name, url] = command.args;

  if (!isModo()) return;

  const ext = (url || "").split(".").pop();

  if (!allowedExtensions.includes(ext)) {
    const ae = allowedExtensions.join(",");
    client.chat.say(message.channel, `Usage: !dl <name> <url> (ext.: ${ae})`);
    return;
  }

  axios({
    url,
    timeout: 0,
    method: "GET",
    responseType: "arraybuffer",
  })
    .then((response) => {
      fs.writeFileSync(path.join(downloadDir, `${name}.${ext}`), response.data);
      client.chat.say(message.channel, `Download done! cmd: !play ${name}`);
    })
    .catch((error) => {
      client.chat.say(message.channel, `Error: ${error.message}`);
    });
};
