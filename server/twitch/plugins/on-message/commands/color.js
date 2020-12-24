module.exports = ({ command, message, client }) => {
  const viewer = message.data.viewer;
  const color = command.args[0];

  if (command.args.length > 1) {
    client.chat.say(message.channel, `Usage: !color <color>`);
    return;
  }

  if (command.args.length === 1) {
    viewer.color = color;
  }

  client.chat.say(message.channel, `${viewer.name} tu as la couleur ${viewer.color}!`);
};