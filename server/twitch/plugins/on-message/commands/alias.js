const alias = {
  discord: `https://discord.com/invite/efXKCS`,
  onlfait: `https://twitch.tv/fablab_onlfait`,
  git: `https://github.com/skarab42 || https://github.com/onlfait`
};

module.exports = ({ command, message, client }) => {
  const text = alias[command.args[0]];
  text && client.chat.say(message.channel, text);
};
