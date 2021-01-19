const clipsStore = require("../../../../store/clips");
const { random } = require("../utils");

module.exports = async ({ command, message, client, isModo }) => {
  let [channel, id, duration] = command.args;

  channel = (channel || "faudrey_voir").toLowerCase();

  if (id) {
    if (!isModo()) return;

    if (!duration) {
      client.chat.say(message.channel, `Usage: !fv <id> <duration>`);
      return;
    }

    clipsStore.set(`list.${channel}`, { id, channel, duration });
    return;
  }

  const clips = clipsStore.get(`list.${channel}`, []);

  if (clips.length) {
    const clip = clips[random(0, clips.length)];
    client.io.emit("faudrey_voir", { name: channel, clip });
    client.chat.say(message.channel, `INTRUSION DE twitch.tv/${channel}`);
  }
};
