const users = require("../../../libs/users");

const delayH = 1;
const delayMs = delayH * 3600000;
const minViewCount = 500;

const sayMessage = "C'est un avion ? une fusée ? non c'est un streamer Twitch";

// 1h00m00s -> 3600000
// 30m00s   -> 1800000
// 60s      -> 60000
function humanTimeToTimestamp(input) {
  const matches = input.match(/([0-9]+h)?([0-9]+m)?([0-9]+s)/);
  if (!matches) return false;
  let [h, m, timestamp] = matches.slice(1, 4).map(i => parseInt(i));
  !isNaN(h) && (timestamp += h * 3600);
  !isNaN(m) && (timestamp += m * 60);
  return timestamp;
}

module.exports = async ({ message, client }, next) => {
  const user = message.data.user;
  const now = message.data.timestamp;
  const elapsed = message.data.timestamp - user.lastHighlight;

  if (message.data.badges.broadcaster) {
    return next();
  }

  // if (message.data.badges.broadcaster) {
  //   console.log("MOI MOI");
  // } else
  if (user.viewCount < minViewCount || elapsed < delayMs) {
    return next();
  }

  const channel = await client.api.kraken.channels.getChannel(user.id);

  function userBanner() {
    client.chat.say(
      message.channel,
      `${sayMessage} -> ${user.name} http://twitch.tv/${user.name}`
    );
  }

  client.api.helix.videos
    .getVideosByUser(user.id)
    .then(({ data }) => {
      user.lastHighlight = now;
      users.update(user);

      if (!data.length) {
        userBanner();
        return next();
      }

      let { id, url, duration } = data[0]._data;
      duration = humanTimeToTimestamp(duration);

      // if (!message.data.badges.broadcaster) {
      client.chat.say(message.channel, `${sayMessage} -> ${user.name} ${url}`);
      // }

      if (!channel._data.mature) {
        client.io.emit("streamer-highlight", { id, user, duration });
      }

      next();
    })
    .catch(error => {
      console.log("ERROR:", error);
      next();
    });
};
