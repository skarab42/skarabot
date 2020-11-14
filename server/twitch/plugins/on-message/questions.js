const logs = require("../../../libs/logs");

module.exports = ({ message, client }, next) => {
  const { avatarURL } = message.data.user;
  const text = message.message;
  const { user } = message;

  const isIdea = text.startsWith("!!!") || text.endsWith("!!!");

  if (text.includes("???") && !isIdea) {
    logs.add("question", { user, avatarURL, text });
    client.io.emit("logs.update", logs.getAll());
  }

  next();
};
