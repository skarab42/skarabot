const users = require("../../../../libs/users");

module.exports = ({ command, message, client }) => {
  const user = message.data.user;
  const color = command.args[0];

  if (command.args.length > 1) {
    client.chat.say(message.channel, `Usage: !color <color>`);
    return;
  }

  if (command.args.length === 1) {
    user.color = color;
    users.update(user);
  }

  client.chat.say(message.channel, `${user.name} tu as la couleur ${user.color}!`);
};