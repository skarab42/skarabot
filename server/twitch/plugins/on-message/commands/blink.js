const { getViewerByName } = require("../../../../libs/viewers");

const maxCount = 42;
const costRatio = 10;

module.exports = async ({ command, message, client }) => {
  const viewer = message.data.viewer;
  let [count, target] = command.args;

  count = parseInt(count);

  if (count > maxCount) {
    count = maxCount;
    client.chat.say(
      message.channel,
      `Désolé ${viewer.name} tu vas blinker que ${maxCount}x.`
    );
  }

  if (isNaN(count) || count <= 0) {
    client.chat.say(message.channel, `Usage: !blink <count> (max:${maxCount})`);
    return;
  }

  const cost = Math.abs(count * costRatio);

  if (viewer.points < cost) {
    client.chat.say(
      message.channel,
      `Désolé ${viewer.name} tu n'as pas assez de points pour blinker (cost: ${cost}).`
    );
    return;
  }

  let targetUser = null;

  if (target) {
    targetUser = await getViewerByName(target);

    if (!targetUser || !targetUser.avatarURL) {
      client.chat.say(
        message.channel,
        `Désolé ${viewer.name} "${target}" est introuvable sur le mur.`
      );
      return;
    }
  }

  viewer.points -= cost;

  client.io.emit("wof.blink", { user: targetUser || viewer, count });
};
