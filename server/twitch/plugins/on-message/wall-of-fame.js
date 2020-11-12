const { screenLimit } = require("./config/wall-of-fame");
const users = require("../../../libs/users");

function random(min, max) {
  return Math.random() * (max - min) + min;
}

module.exports = ({ message }, next) => {
  const { user } = message.data;

  if (user.lastSeen === 0) {
    message.data.user = users.update({
      ...user,
      position: {
        x: random(0, screenLimit.x),
        y: random(0, screenLimit.y),
      },
    });
  }

  next();
};
