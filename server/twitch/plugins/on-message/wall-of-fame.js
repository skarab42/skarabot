const { screenSize, imgSize } = require("./config/wall-of-fame");
const users = require("../../../libs/users");

screenSize.width -= imgSize.width;
screenSize.height -= imgSize.height;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

module.exports = ({ message }, next) => {
  const { user } = message.data;

  if (user.lastSeen === 0) {
    message.data.user = users.update({
      ...user,
      position: {
        x: random(0, screenSize.width),
        y: random(0, screenSize.height)
      }
    });
  }

  next();
};
