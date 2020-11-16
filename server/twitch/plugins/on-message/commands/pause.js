const { humanTimeToTimestamp } = require("../utils");

// DONE: command !pause <in>
// DONE: pick random start location
// DONE: increase countound if < 0 -> +42s
// DONE: command !pause stop

// WIP: loop videos

// TODO: command !pause [+-]<user> | check if mature chanel
// TODO: show live stream first

const channels = [
  "iti63",
  "iti63",
  "iti63",
  // "jenaiccambre",
  // "gnu_coding_cafe",
  // "akanoa",
  // "dannou",
  // "delphes99",
  // "dooctrix",
  // "sirlynixvanfrietjes",
  // "fablab_onlfait",
  // "ioodyme",
  // "iti63",
  // "jenaiccambre",
  // "gnu_coding_cafe",
  // "akanoa",
  // "dannou",
  // "delphes99",
  // "dooctrix",
  // "sirlynixvanfrietjes",
  // "fablab_onlfait",
  // "ioodyme",
];

async function getVideoByUserName(client, name) {
  const userId = await client.api.helix.users.getUserByName(name);
  const { data } = await client.api.helix.videos.getVideosByUser(userId);
  if (!data.length) return null;
  let { id, duration } = data[0]._data;
  duration = humanTimeToTimestamp(duration);
  return { id, user: { name }, duration };
}

module.exports = ({ command, message, client }) => {
  const user = message.data.user;
  let [minutes] = command.args;

  if (!message.data.badges.broadcaster) {
    client.chat.say(message.channel, `Usage: pas pour toi ${user.name} Kappa`);
    return;
  }

  if (minutes === "stop") {
    return client.emit("pause.stop");
  }

  minutes = parseFloat(minutes);

  if (!minutes || isNaN(minutes)) {
    client.chat.say(message.channel, `Usage: !pause <int>`);
    return;
  }

  const promises = channels.map((name) => getVideoByUserName(client, name));

  Promise.all(promises)
    .then((videos) => {
      videos = videos.filter((video) => video);
      client.emit("pause.start", { minutes, videos });
    })
    .catch((error) => {
      console.log("ERROR >>>", error);
    });
};
