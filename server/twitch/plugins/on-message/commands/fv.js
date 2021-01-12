const clips = require("../../../../store/clips");

module.exports = async ({ command, message, client, isModo }) => {
  let [channel, id, duration] = command.args;

  channel = (channel || "faudrey_voir").toLowerCase();

  if (id) {
    if (!isModo()) return;

    if (!duration) {
      client.chat.say(message.channel, `Usage: !fv <id> <duration>`);
      return;
    }

    clips.set(`list.${channel}`, { id, channel, duration });
    return;
  }

  const clip = clips.get(`list.${channel}`);

  if (clip) {
    client.io.emit("faudrey_voir", { name: channel, clip });
    client.chat.say(message.channel, `INTRUSION DE twitch.tv/${channel}`);
  }
};
