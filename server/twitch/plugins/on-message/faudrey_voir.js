const clips = require("../../../store/clips");

module.exports = async ({ message, client }, next) => {
  const viewer = message.data.viewer;

  if (!message.data.isFirstMessage) {
    return next();
  }

  const name = viewer.name.toLowerCase();
  const clip = clips.get(`list.${name}`);

  if (clip) {
    client.io.emit("faudrey_voir", { name, clip });
    client.chat.say(message.channel, `INTRUSION DE twitch.tv/${name}`);
  }

  next();
};
