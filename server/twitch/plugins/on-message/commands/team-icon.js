const { downloadDir } = require("../config/download");

const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

// const teamsStore = require("../../../../libs/teams");

const allowedExtensions = ["svg"];

module.exports = ({ command, message, client }) => {
  const viewer = message.data.viewer;
  const badges = viewer.badges;
  const sudo = badges.broadcaster || badges.moderator;

  if (!sudo) {
    client.chat.say(
      message.channel,
      `Usage: pas pour toi ${viewer.name} Kappa`
    );
    return;
  }

  if (command.args.length !== 2) {
    client.chat.say(message.channel, `Usage: !team-icon <team> <svg-url>`);
    return;
  }

  let [team, url] = command.args;

  const ext = (url || "").split(".").pop();

  if (!allowedExtensions.includes(ext)) {
    client.chat.say(message.channel, `ATTENTION c'est pas un SVG!`);
    return;
  }

  axios({
    url,
    timeout: 0,
    method: "GET",
    responseType: "arraybuffer",
  })
    .then((response) => {
      const icon = `${team}.${ext}`;
      fs.writeFileSync(path.join(downloadDir, "icons", icon), response.data);
      client.chat.say(message.channel, `Icone de la team ${team} téléchargé!`);
      // teamsStore.set(team, { name: team, icon })
    })
    .catch((error) => {
      client.chat.say(message.channel, `Error: ${error.message}`);
    });

  // client.chat.say(message.channel, `${user.name} tu fais parti de la team ${user.team}!`);
};
