const { screenLimit } = require("./config/wall-of-fame");

function random(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

module.exports = ({ message, client }, next) => {
  const viewer = message.data.viewer;

  if (message.data.isFirstMessage) {
    viewer.position = {
      x: random(0, screenLimit.x),
      y: random(0, screenLimit.y),
    };

    client.emit("wof.add-user", viewer);
  }

  next();
};
