const alias = require("../../../../store/alias");

const ignores = ["theme", "line", "highlight"];

module.exports = ({ command, message, client, isModo }) => {
  let [name, ...args] = command.args;
  let value = args.join(" ").trim();

  if (!name) {
    client.chat.say(message.channel, `Usage: !alias <name> <value>`);
    return;
  }

  if (name[0] === "+" && value) {
    isModo() && alias.set(`list.${name.slice(1)}`, value);
  } else if (name[0] === "-") {
    isModo() && alias.delete(`list.${name.slice(1)}`);
  } else if (!ignores.includes(name)) {
    value = alias.get(`list.${name}`);
    value && client.chat.say(message.channel, value);
  }
};
