const logs = require("../../../libs/logs");

module.exports = ({ message, client }, next) => {
  const text = message.message;
  const { user } = message;

  const isIdea = text.startsWith("!!!") || text.endsWith("!!!");

  if (text.includes("???") && !isIdea) {
    logs.add("question", { user, text });
    client.io.emit("logs.update", logs.getAll());
  }

  next();
};
