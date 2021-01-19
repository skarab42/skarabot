const clipsStore = require("../../../store/clips");
const { random } = require("./utils");

module.exports = async ({ message, client }, next) => {
  const viewer = message.data.viewer;

  if (!message.data.isFirstMessage) {
    return next();
  }

  const name = viewer.name.toLowerCase();
  const clips = clipsStore.get(`list.${name}`, []);

  if (clips.length) {
    const clip = clips[random(0, clips.length)];
    client.io.emit("faudrey_voir", { name, clip });
    client.chat.say(message.channel, `INTRUSION DE twitch.tv/${name}`);
  }

  next();
};
