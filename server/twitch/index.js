const TwitchClient = require("./Client");
const config = require("../config");

const twitchClient = new TwitchClient(config.twitch);
const twitchAuth = twitchClient.auth.bind(twitchClient);

module.exports = {
  twitchClient,
  twitchAuth,
};
