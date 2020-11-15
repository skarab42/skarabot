const { humanTimeToTimestamp } = require("../utils");

// DONE: command !pause <in>
// TODO: command !pause stop
// TODO: command !pause [+-]<user>
// TODO: loop videos, increase countound if < 0 -> +42s

const channels = [
  "iti63",
  "jenaiccambre",
  "gnu_coding_cafe",
  "akanoa",
  "delphes99",
  "dooctrix",
  "sirlynixvanfrietjes",
  "fablab_onlfait",
  "ioodyme",
];

module.exports = ({ command, message, client }) => {
  const user = message.data.user;
  let [minutes] = command.args;

  if (!message.data.badges.broadcaster) {
    client.chat.say(message.channel, `Usage: pas pour toi ${user.name} Kappa`);
    return;
  }

  minutes = parseInt(minutes);

  if (!minutes || isNaN(minutes)) {
    client.chat.say(message.channel, `Usage: !pause <int>`);
    return;
  }

  channels.forEach(async (channel) => {
    const userId = await client.api.helix.users.getUserByName(channel);
    const { data } = await client.api.helix.videos.getVideosByUser(userId);
    if (!data.length) return null;
    let { id, duration } = data[0]._data;
    duration = humanTimeToTimestamp(duration);
    client.emit("streamer-highlight", {
      id,
      user: { name: channel },
      channel: message.channel,
      duration,
    });
  });

  client.emit("pause", { minutes });
};
