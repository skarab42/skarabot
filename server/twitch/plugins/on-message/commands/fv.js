const clips = require("../../../../store/clips");

module.exports = async ({ command, message, client }) => {
  const viewer = message.data.viewer;
  const badges = viewer.badges;
  const sudo = badges.broadcaster || badges.moderator;

  let [channel, id, duration] = command.args;

  channel = (channel || "faudrey_voir").toLowerCase();

  if (id) {
    if (!sudo) {
      client.chat.say(
        message.channel,
        `Usage: pas pour toi ${viewer.name} Kappa`
      );
      return;
    }

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
