module.exports = ({ message, client }) => {
  const user = message.data.user;
  const points = Math.floor(user.points);
  client.chat.say(message.channel, `${user.name} tu as ${points}pts.`);
};
