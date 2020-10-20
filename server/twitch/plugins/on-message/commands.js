const { screenLimit } = require("./config/wall-of-fame");
const users = require("../../../libs/users");
// X = cos(Angle) * distance ; Y = -sin(Angle) * distance

function minMax(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

module.exports = ({ message, client }, next) => {
  let user = message.data.user;
  const text = message.message;

  if (text[0] === "!") {
    const args = text.slice(1).split(" ");
    const cmd = args.shift();

    if (cmd === "points") {
      const points = user.points.toFixed(2);
      client.chat.say(message.channel, `${user.name} tu as ${points}pts.`);
    } else if (cmd === "discord") {
      client.chat.say(message.channel, `https://discord.com/invite/efXKCS`);
    } else if (cmd === "onlfait") {
      client.chat.say(message.channel, `https://twitch.tv/fablab_onlfait`);
    } else if (cmd === "git") {
      client.chat.say(
        message.channel,
        `https://github.com/skarab42 || https://github.com/onlfait`
      );
    } else if (cmd === "move") {
      const offsets = { x: 0, y: 0 };

      args.forEach(arg => {
        const key = arg[0];
        const val = arg.slice(1);
        offsets[key] = parseInt(val);
      });

      const cost = (Math.abs(offsets.x) + Math.abs(offsets.y)) * 0.1;

      console.log({ cost });

      if (user.points < cost) {
        client.chat.say(
          message.channel,
          `Désolé ${user.name} tu n'as pas assez de points pour te déplacer (cost: ${cost}).`
        );
      } else if (isNaN(offsets.x) || isNaN(offsets.y)) {
        client.chat.say(message.channel, `Usage: !move <int> <int>`);
      } else {
        user.points -= cost;
        user.position.x = minMax(0, screenLimit.x, user.position.x + offsets.x);
        user.position.y = minMax(0, screenLimit.y, user.position.y + offsets.y);
        users.update(user);
        client.emit("wall-of-fame.move", message);
      }
    }
  }

  next();
};
