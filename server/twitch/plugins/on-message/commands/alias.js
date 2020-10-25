const alias = require("../config/alias");

module.exports = ({ command, message, client }) => {
  const text = alias[command.args[0]];
  text && client.chat.say(message.channel, text);
};
