module.exports = ({ message, client }, next) => {
  let user = message.data.user;
  const text = message.message;

  if (text[0] === "!") {
    const args = text.slice(1).split(" ");
    const cmd = args.shift();

    if (cmd === "points") {
      const points = user.points.toFixed(2);
      client.chat.say(message.channel, `${user.name} tu as ${points}pts.`);
    } else if (cmd === "discord") {
      client.chat.say(message.channel, `https://discord.com/invite/efXKCS`);
    } else if (cmd === "git") {
      client.chat.say(
        message.channel,
        `https://github.com/skarab42 || https://github.com/onlfait`
      );
    }
  }

  next();
};
