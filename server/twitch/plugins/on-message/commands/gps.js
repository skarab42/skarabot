const treasureChestStore = require("../../../../store/treasure-chest");
const { distance } = require("../utils");

const commandCost = 5;
const cooldownTimeout = 60;

module.exports = ({ message, client, cooldown }) => {
  const viewer = message.data.viewer;

  if (viewer.points < commandCost) {
    return client.chat.say(
      message.channel,
      `Désolé ${viewer.name} tu n'as pas assez de points pour te déplacer (cost: ${commandCost}).`
    );
  }

  if (cooldown(`cmd.gps:${viewer.name}`, cooldownTimeout)) return;

  let chestPoints = treasureChestStore.get("points");
  const chestPosition = treasureChestStore.get("position");
  let diff = distance(chestPosition, viewer.position);

  chestPoints += commandCost * 2;
  viewer.points -= commandCost;

  treasureChestStore.set("points", chestPoints);

  client.chat.say(
    message.channel,
    `${viewer.name} tu es à ${diff} px du trésor (${chestPoints} pts).`
  );
};
