const { getViewerByName } = require("../../../../libs/viewers");

module.exports = async ({ command, message, client, isModo }) => {
  let [nick, points] = command.args;

  if (!isModo()) return;

  points = parseInt(points);

  if (!nick || !points || isNaN(points)) {
    client.chat.say(message.channel, `Usage: !add-points <nick> <points>`);
    return;
  }

  let targetViewer = await getViewerByName(nick);

  if (!targetViewer) {
    client.chat.say(message.channel, `L'utilisateur ${nick} est introuvable!`);
    return;
  }

  targetViewer.points += points;
  await targetViewer.save();

  const cleanPoints = Math.floor(targetViewer.points);
  client.chat.say(message.channel, `${nick} tu as ${cleanPoints}pts.`);
};
