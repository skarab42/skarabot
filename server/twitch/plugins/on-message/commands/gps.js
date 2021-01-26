const treasureChestStore = require("../../../../store/treasure-chest");
const { distance } = require("../utils");

const commandCost = 5;
const cooldownTimeout = 60;

module.exports = ({ message, client, cooldown }) => {
  if (cooldown("cmd.gps", cooldownTimeout)) return;

  const viewer = message.data.viewer;
  let chestPoints = treasureChestStore.get("points");
  const chestPosition = treasureChestStore.get("position");

  let diff = distance(chestPosition, viewer.position);

  chestPoints += commandCost;
  viewer.points -= commandCost;

  treasureChestStore.set("points", chestPoints);

  client.chat.say(
    message.channel,
    `${viewer.name} tu es à ${diff} px du trésor (${chestPoints} pts).`
  );
};
