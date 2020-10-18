module.exports = ({ client, message }, next) => {
  client.emit("twitch.chat.onMessage", message);
  next();
};
