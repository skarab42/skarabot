const users = require("../../../../libs/users");

module.exports = ({ command, message, client }) => {
  const user = message.data.user;
  const team = command.args[0];

  if (command.args.length > 1) {
    client.chat.say(message.channel, `Usage: !team <team>`);
    return;
  }

  if (command.args.length === 1) {
    user.team = team;
    users.update(user);
  }

  client.chat.say(message.channel, `${user.name} tu fais parti de la team ${user.team}!`);
};
