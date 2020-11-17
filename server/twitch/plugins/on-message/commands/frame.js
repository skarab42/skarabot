// import urlParser from "js-video-url-parser/lib/base";
// import "js-video-url-parser/lib/provider/youtube";
// import "js-video-url-parser/lib/provider/twitch";

const urlParser = require("js-video-url-parser/lib/base");
require("js-video-url-parser/lib/provider/youtube");

module.exports = async ({ command, message, client }) => {
  const { user } = message.data;
  let [url] = command.args;

  if (!message.data.badges.broadcaster) {
    client.chat.say(message.channel, `Usage: pas pour toi ${user.name} Kappa`);
    return;
  }

  const target = urlParser.parse(url);

  if (!target) {
    return client.chat.say(
      message.channel,
      `Usage: !frame <url> (youtube|twitch)`
    );
  }

  client.io.emit("frame.push", target);
};
