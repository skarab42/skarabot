const logs = require("../../../libs/logs");

module.exports = ({ message, client }, next) => {
  const { team, color, avatarURL } = message.data.user;
  let { user, emotes } = message;
  const text = message.message;

  if (text[0] === '!') return next();


  let type = 'message';

  if (text.includes("@idée")) {
    type = 'idea'
  } else if (text.includes("@question")) {
    type = 'question'
  }

  emotes = emotes.map(({id, name, type, text}) => ({id, name, type, text}))

  logs.add(type, { user, team, color, avatarURL, emotes });
  client.io.emit("logs.update", logs.getAll());

  next();
};
