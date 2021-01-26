const treasureChestStore = require("../../../../store/treasure-chest");
const { screenLimit } = require("../config/wall-of-fame");
const { random, distance, minMax } = require("../utils");

const costRatio = 0.1;

function setRandomPosition() {
  treasureChestStore.set("position", {
    x: random(0, screenLimit.x),
    y: random(0, screenLimit.y),
  });
}

module.exports = ({ command, message, client }) => {
  const viewer = message.data.viewer;
  const offsets = { x: 0, y: 0 };

  command.args.forEach((arg) => {
    const key = arg[0];
    const val = arg.slice(1);
    offsets[key] = parseInt(val);
  });

  let newPosition = {
    x: minMax(0, screenLimit.x, viewer.position.x + offsets.x),
    y: minMax(0, screenLimit.y, viewer.position.y + offsets.y),
  };

  const cost = Math.ceil(distance(newPosition, viewer.position) * costRatio);

  if (viewer.points < cost) {
    client.chat.say(
      message.channel,
      `Désolé ${viewer.name} tu n'as pas assez de points pour te déplacer (cost: ${cost}).`
    );
  } else if (isNaN(offsets.x) || isNaN(offsets.y)) {
    client.chat.say(message.channel, `Usage: !move <int> <int>`);
  } else {
    viewer.points -= cost;
    viewer.position = newPosition;

    const chestPosition = treasureChestStore.get("position");
    const diff = distance(chestPosition, viewer.position);

    client.chat.say(
      message.channel,
      `${viewer.name} [${viewer.position.x},${viewer.position.y}]`
    );

    if (diff === 0) {
      let chestPoints = treasureChestStore.get("points");
      client.chat.say(
        message.channel,
        `${viewer.name} a trouvé le trésor (${chestPoints} pts) !!!`
      );
      client.emit("treasureChest.newOwner", viewer);
      treasureChestStore.set("owner", viewer.id);
      treasureChestStore.set("points", 0);
      viewer.points += chestPoints;
      setRandomPosition();
    }

    client.emit("wof.move", message);
  }
};
