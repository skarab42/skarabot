const logs = require("../../../libs/logs");

module.exports = ({ message, client }, next) => {
  const question = message.message;
  const { user } = message;

  if (question.includes("?")) {
    logs.add("question", { user, question });
    client.io.emit("logs.update", logs.getAll());
  }

  next();
};
