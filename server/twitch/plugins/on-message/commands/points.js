module.exports = ({ message, client }) => {
  const viewer = message.data.viewer;
  const points = Math.floor(viewer.points);
  client.chat.say(message.channel, `${viewer.name} tu as ${points}pts.`);
};
