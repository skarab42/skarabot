const urlParser = require("js-video-url-parser/lib/base");
require("js-video-url-parser/lib/provider/youtube");
require("js-video-url-parser/lib/provider/twitch");

module.exports = async ({ command, message, client }) => {
  const { user } = message.data;
  let [url] = command.args;

  if (url.match(/^[a-z0-9_]+$/i)) {
    url = `https://twitch.tv/${url}`;
  }

  const target = urlParser.parse(url);

  if (!target) {
    return client.chat.say(
      message.channel,
      `Usage: !frame <url> (youtube|twitch)`
    );
  }

  if (!message.data.badges.broadcaster && target.provider !== "twitch") {
    client.chat.say(message.channel, `Usage: pas pour toi ${user.name} Kappa`);
    return;
  }

  client.io.emit("frame.push", target);
};
