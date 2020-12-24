const alias = require("../../../../store/alias");

const ignores = [];

module.exports = ({ command, message, client }) => {
  const viewer = message.data.viewer;
  let [name, ...args] = command.args;
  let value = args.join(" ").trim();

  const user = message.user;
  const badges = viewer.badges;
  const sudo = badges.broadcaster || badges.moderator;

  if (!name) {
    client.chat.say(message.channel, `Usage: !alias <name> <value>`);
    return;
  }

  if (name[0] === "+" && value) {
    sudo && alias.set(`list.${name.slice(1)}`, value);
  } else if (name[0] === "-") {
    sudo && alias.delete(`list.${name.slice(1)}`);
  } else if (!ignores.includes(name)) {
    value = alias.get(`list.${name}`);
    const text = value || `!${name} !?! C'est pas faux @${user} skarab1337`;
    client.chat.say(message.channel, text);
  }
};
