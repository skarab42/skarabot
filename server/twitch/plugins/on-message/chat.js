const { addMessage, computeMessage } = require('../../../libs/chat');

module.exports = async ({ message, client }, next) => {
  if (message.message[0] === '!') return next();

  const messageModel = await addMessage({
    viewerId: message.data.viewer.id,
    time: new Date(message.data.timestamp),
    message: computeMessage(message.emotes)
  });

  client.io.emit("chat.new-message", messageModel.toJSON());

  next();
};
