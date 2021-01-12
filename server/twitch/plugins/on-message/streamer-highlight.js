const frameCommand = require("./commands/frame");

const delayH = 2;
const delayMs = delayH * 3600000;
const minViewCount = 500;

const sayMessage = "C'est un avion ? une fusée ? non c'est un streamer Twitch";

module.exports = async ({ message, client, ...helpers }, next) => {
  const viewer = message.data.viewer;
  const now = message.data.timestamp;
  const elapsed = message.data.timestamp - viewer.lastHighlight;

  if (viewer.badges.broadcaster) {
    return next();
  }

  if (viewer.viewCount < minViewCount || elapsed < delayMs) {
    return next();
  }

  // const channel = await client.api.kraken.channels.getChannel(user.id);
  const banner = `${sayMessage} -> ${viewer.name} | http://twitch.tv/${viewer.name}`;

  client.api.helix.videos
    .getVideosByUser(viewer.id)
    .then(({ data }) => {
      viewer.lastHighlight = now;

      if (!data.length) {
        client.chat.say(message.channel, banner);
        return next();
      }

      let { url } = data[0]._data;

      client.chat.say(message.channel, `${banner} | ${url} |`);

      // if (!channel._data.mature) {
      const command = { name: "frame", args: [viewer.name] };
      frameCommand({ command, message, client, ...helpers });
      // }

      next();
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log("ERROR:", error); // TODO handle error...
      next();
    });
};
