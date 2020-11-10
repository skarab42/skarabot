const users = require("../../../../libs/users");

module.exports = ({ command, message, client }) => {
  const user = message.data.user;
  let [nick, points] = command.args;

  if (!message.data.badges.broadcaster) {
    client.chat.say(message.channel, `Usage: pas pour toi ${user.name} Kappa`);
    return;
  }

  const userStore = users.getByName(nick);

  if (!userStore) {
    client.chat.say(message.channel, `L'utilisateur ${nick} est introuvable!`);
    return;
  }

  points = parseInt(points);

  if (!nick || !points) {
    client.chat.say(message.channel, `Usage: !add-points <nick> <points>`);
    return;
  }

  user.points += points;
  users.update(user);

  client.chat.say(message.channel, `${nick} tu as ${user.points}pts.`);
};
