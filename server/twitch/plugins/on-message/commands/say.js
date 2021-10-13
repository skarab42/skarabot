const tts = require("./tts");

const cooldownTimeout = 30;

module.exports = ({ command, message, client, cooldown }) => {
  if (cooldown("cmd.say", cooldownTimeout)) return;

  const text = command.args.join(" ");

  if (!text) {
    client.chat.say(message.channel, `Usage: !say <text>`);
    return;
  }

  tts(message.data.viewer.name, text);
};
