const alias = require("../../../../store/alias");

module.exports = ({ command, message, client }) => {
  let [name, ...args] = command.args;
  let value = args.join(" ").trim();

  if (name[0] === "+" && value) {
    alias.set(`list.${name.slice(1)}`, value);
  } else if (name[0] === "-") {
    alias.delete(`list.${name.slice(1)}`);
  } else {
    value = alias.get(`list.${name}`);
    value && client.chat.say(message.channel, value);
  }
};
