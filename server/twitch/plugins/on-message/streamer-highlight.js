const users = require("../../../libs/users");

const delayH = 1;
const delayMs = delayH * 3600000;
const minViewCount = 500;

const sayMessage = "C'est un avion ? une fusée ? non c'est un streamer Twitch";

module.exports = ({ message, client }, next) => {
  const user = message.data.user;
  const now = message.data.timestamp;
  const elapsed = message.data.timestamp - user.lastHighlight;

  if (user.viewCount < minViewCount || elapsed < delayMs) {
    return next();
  }

  client.api.helix.videos
    .getVideosByUser(user.id)
    .then(({ data }) => {
      user.lastHighlight = now;
      users.update(user);

      if (!data.length) {
        client.chat.say(
          message.channel,
          `${sayMessage} -> ${user.name} http://twitch.tv/${user.name}`
        );
        return next();
      }

      const { url, viewable } = data[0]._data;

      client.chat.say(message.channel, `${sayMessage} -> ${user.name} ${url}`);

      if (viewable !== "public") {
        return next();
      }

      next();
    })
    .catch(error => {
      console.log("ERROR:", error);
      next();
    });
};
