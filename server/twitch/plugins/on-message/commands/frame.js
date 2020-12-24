const { getRandomVideoByUserName, getStreamByUserName } = require("../utils");
const urlParser = require("js-video-url-parser/lib/base");
require("js-video-url-parser/lib/provider/youtube");
require("js-video-url-parser/lib/provider/twitch");

const cooldownTimeout = 15;

let currentChannel = null;

module.exports = async ({ command, message, client, cooldown }) => {
  const viewer = message.data.viewer;
  let [url] = command.args;

  if (!url && currentChannel) {
    return client.chat.say(
      message.channel,
      `Vous regardez ${currentChannel} !`
    );
  }

  if ((url || "").match(/^[a-z0-9_]+$/i)) {
    url = `https://twitch.tv/${url}`;
  }

  let target = urlParser.parse(url);

  if (!target) {
    return client.chat.say(
      message.channel,
      `Usage: !frame <url> (youtube|twitch)`
    );
  }

  currentChannel =
    target.provider === "twitch" ? `twitch.tv/${target.channel} !` : url;

  if (!viewer.badges.broadcaster && target.provider !== "twitch") {
    client.chat.say(message.channel, `Usage: pas pour toi ${viewer.name} Kappa`);
    return;
  }

  if (cooldown("cmd.frame", cooldownTimeout)) return;

  if (target.provider === "twitch" && target.mediaType === "stream") {
    const stream = await getStreamByUserName({ client, name: target.channel });

    if (!stream) {
      const video = await getRandomVideoByUserName({
        client,
        mature: true,
        name: target.channel,
        channel: message.channel,
      });
      if (!video) {
        return client.chat.say(
          message.channel,
          `Aucune vidéo "publique" trouvé chez ${target.channel}`
        );
      }
      target = { ...target, ...video, mediaType: "video" };
    }
  }

  client.io.emit("frame.push", target);
};
