const chalk = require("chalk");

const cost = 10;
const colors = new chalk.Instance({ level: 3 });

module.exports = ({ command, message, client }) => {
  const viewer = message.data.viewer;
  let errorMessage = command.args.join(" ").trim();

  if (viewer.points < cost) {
    return client.chat.say(
      message.channel,
      `Désolé ${viewer.name} tu n'as pas assez de points pour troller (cost: ${cost}).`
    );
  }

  if (!errorMessage.length) {
    return client.chat.say(message.channel, `Usage: !error <message>`);
  }

  viewer.points -= cost;

  // eslint-disable-next-line no-console
  console.log(colors.red.bold(errorMessage));
};
