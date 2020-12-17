const logs = require("../../../libs/logs");

module.exports = ({ message, client }, next) => {
  const { avatarURL } = message.data.user;
  const text = message.message;
  const { user } = message;

  let type = 'message';

  if (text.includes("@idée")) {
    type = 'idea'
  } else if (text.includes("@question")) {
    type = 'question'
  }

  logs.add(type, { user, avatarURL, text });
  client.io.emit("logs.update", logs.getAll());

  next();
};
