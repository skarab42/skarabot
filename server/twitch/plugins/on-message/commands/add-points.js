const users = require("../../../../libs/users");

module.exports = ({ command, message, client }) => {
  const user = message.data.user;
  let [nick, points] = command.args;

  if (!(message.data.badges.broadcaster || message.data.badges.moderator)) {
    client.chat.say(message.channel, `Usage: pas pour toi ${user.name} Kappa`);
    return;
  }

  points = parseInt(points);

  if (!nick || !points || isNaN(points)) {
    client.chat.say(message.channel, `Usage: !add-points <nick> <points>`);
    return;
  }

  let userStore = users.getByName(nick);

  if (!userStore) {
    client.chat.say(message.channel, `L'utilisateur ${nick} est introuvable!`);
    return;
  }

  if (userStore.id === user.id) {
    userStore = user;
  }

  userStore.points += points;
  users.update(userStore);

  const cleanPoints = Math.floor(userStore.points);

  client.chat.say(message.channel, `${nick} tu as ${cleanPoints}pts.`);
};
