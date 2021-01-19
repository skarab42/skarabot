const { screenLimit } = require("./config/wall-of-fame");
const { random } = require("./utils");

function setRandomPosition(viewer) {
  viewer.position = {
    x: random(0, screenLimit.x),
    y: random(0, screenLimit.y),
  };
}

module.exports = ({ message, client }, next) => {
  const viewer = message.data.viewer;

  if (message.data.isFirstMessage || viewer.messageCount === 1) {
    setRandomPosition(viewer);
    client.emit("wof.add-viewer", viewer);
  }

  next();
};
