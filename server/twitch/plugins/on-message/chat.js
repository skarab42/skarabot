const { addMessage, computeMessage } = require("../../../libs/chat");

const ranking = {};

module.exports = async ({ message, client }, next) => {
  if (message.message[0] === "!") return next();

  const messageModel = await addMessage({
    viewerId: message.data.viewer.id,
    time: new Date(message.data.timestamp),
    message: computeMessage(message.emotes),
  });

  const team = message.data.team;

  if (team) {
    if (!ranking[team.name]) {
      ranking[team.name] = { messageCount: 0 };
    }
    ranking[team.name].messageCount++;
  }

  client.io.emit("team.ranking", ranking);
  client.io.emit("chat.new-message", {
    ...messageModel.get({ plain: true }),
    team,
  });

  next();
};
