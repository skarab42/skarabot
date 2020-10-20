module.exports = ({ message, client }) => {
  const user = message.data.user;
  const points = user.points.toFixed(2);
  client.chat.say(message.channel, `${user.name} tu as ${points}pts.`);
};
