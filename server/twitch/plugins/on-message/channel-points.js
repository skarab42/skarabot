function addPoints(message, client, points) {
  const viewer = message.data.viewer;
  viewer.points += points;
  points = Math.floor(viewer.points);
  client.chat.say(message.channel, `${viewer.name} tu as ${points}pts.`);
}

const actions = {
  "25cbf6d5-f4cc-4db3-aa75-5938348c757c": (message, client) => {
    addPoints(message, client, 100);
  },
  "83f0b8a2-3337-40e1-964b-577b4870cd93": (message, client) => {
    addPoints(message, client, 1000);
  },
};

module.exports = ({ message, client }, next) => {
  const rewardId = message.msg._tags["custom-reward-id"];
  //console.log(rewardId);

  if (!rewardId) {
    return next();
  }

  const action = actions[rewardId];

  if (!action) {
    return next();
  }

  action(message, client);

  next();
};
