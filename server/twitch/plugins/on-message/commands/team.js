module.exports = ({ command, message, client }) => {
  const viewer = message.data.viewer;
  const team = command.args[0];

  if (command.args.length > 1) {
    client.chat.say(message.channel, `Usage: !team <team>`);
    return;
  }

  if (command.args.length === 1) {
    viewer.team = team;
  }

  client.chat.say(
    message.channel,
    `${viewer.name} tu fais parti de la team ${viewer.team}!`
  );
};
