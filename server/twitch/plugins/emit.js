module.exports = function emit(chatMessage, next) {
  this.emit("twitch.chat.onMessage", chatMessage);
  next();
};
