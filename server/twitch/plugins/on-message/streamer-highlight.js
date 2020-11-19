const { humanTimeToTimestamp } = require("./utils");
const users = require("../../../libs/users");

const delayH = 2;
const delayMs = delayH * 3600000;
const minViewCount = 500;

const sayMessage = "C'est un avion ? une fusée ? non c'est un streamer Twitch";

module.exports = async ({ message, client }, next) => {
  const user = message.data.user;
  const now = message.data.timestamp;
  const elapsed = message.data.timestamp - user.lastHighlight;

  if (message.data.badges.broadcaster) {
    return next();
  }

  if (user.viewCount < minViewCount || elapsed < delayMs) {
    return next();
  }

  const channel = await client.api.kraken.channels.getChannel(user.id);
  const banner = `${sayMessage} -> ${user.name} | http://twitch.tv/${user.name}`;

  client.api.helix.videos
    .getVideosByUser(user.id)
    .then(({ data }) => {
      user.lastHighlight = now;
      users.update(user);

      if (!data.length) {
        client.chat.say(message.channel, banner);
        return next();
      }

      let { id, url, duration } = data[0]._data;
      duration = humanTimeToTimestamp(duration);

      client.chat.say(message.channel, `${banner} | ${url} |`);

      if (!channel._data.mature) {
        client.io.emit("frame.push", {
          provider: "twitch",
          mediaType: "video",
          duration,
          user,
          id,
        });
      }

      next();
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log("ERROR:", error); // TODO handle error...
      next();
    });
};
