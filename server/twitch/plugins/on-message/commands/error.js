const users = require("../../../../libs/users");
const chalk = require("chalk");

const cost = 10;
const colors = new chalk.Instance({ level: 3 });

module.exports = ({ command, message, client }) => {
  const user = message.data.user;
  let errorMessage = command.args.join(" ").trim();

  if (user.points < cost) {
    return client.chat.say(
      message.channel,
      `Désolé ${user.name} tu n'as pas assez de points pour troller (cost: ${cost}).`
    );
  }

  if (!errorMessage.length) {
    return client.chat.say(message.channel, `Usage: !error <message>`);
  }

  user.points -= cost;
  users.update(user);

  // eslint-disable-next-line no-console
  console.log(colors.red.bold(errorMessage));
};
