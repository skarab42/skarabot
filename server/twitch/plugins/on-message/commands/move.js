const { screenLimit } = require("../config/wall-of-fame");

function minMax(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

// X = cos(Angle) * distance ; Y = -sin(Angle) * distance

module.exports = ({ command, message, client }) => {
  const viewer = message.data.viewer;
  const offsets = { x: 0, y: 0 };

  command.args.forEach((arg) => {
    const key = arg[0];
    const val = arg.slice(1);
    offsets[key] = parseInt(val);
  });

  const cost = (Math.abs(offsets.x) + Math.abs(offsets.y)) * 0.1;

  if (viewer.points < cost) {
    client.chat.say(
      message.channel,
      `Désolé ${viewer.name} tu n'as pas assez de points pour te déplacer (cost: ${cost}).`
    );
  } else if (isNaN(offsets.x) || isNaN(offsets.y)) {
    client.chat.say(message.channel, `Usage: !move <int> <int>`);
  } else {
    viewer.points -= cost;
    viewer.position.x = minMax(0, screenLimit.x, viewer.position.x + offsets.x);
    viewer.position.y = minMax(0, screenLimit.y, viewer.position.y + offsets.y);

    client.emit("wof.move", message);
  }
};
