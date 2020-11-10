const alias = require("../../../../store/alias");

module.exports = ({ command, message, client }) => {
  let [name, ...args] = command.args;
  let value = args.join(" ").trim();

  const user = message.user;
  const sudo = message.data.badges.broadcaster;

  if (name[0] === "+" && value) {
    sudo && alias.set(`list.${name.slice(1)}`, value);
  } else if (name[0] === "-") {
    sudo && alias.delete(`list.${name.slice(1)}`);
  } else {
    value = alias.get(`list.${name}`);
    const text = value || `!${name} !?! C'est pas faux @${user} skarab1337`;
    client.chat.say(message.channel, text);
  }
};
