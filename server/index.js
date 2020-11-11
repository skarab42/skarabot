const { name, version } = require("../package.json");
const userAPI = require("./twitch/plugins/user-api");
const logsAPI = require("./twitch/plugins/logs-api");
const TwitchClient = require("./twitch/Client");
const config = require("./config");
const socketIO = require("./io");
const polka = require("polka");
const sirv = require("sirv");

const twitchClient = new TwitchClient(config.twitch);
const twitchAuth = twitchClient.auth.bind(twitchClient);
const public = sirv(config.server.publicPath, { dev: true });

const { server } = polka()
  .use(public)
  .use(twitchAuth)
  .use(userAPI)
  .use(logsAPI)
  .listen(config.server.port, async err => {
    if (err) throw err;
    /* eslint-disable no-console */
    console.log(`> ${name} v${version}`);
    console.log(`> running on ${config.server.address}`);
    /* eslint-enable no-console */
  });

twitchClient
  .setSocketIO(socketIO(server))
  .onMessage(require("./twitch/plugins/on-message/timestamp"))
  .onMessage(require("./twitch/plugins/on-message/start-time"))
  .onMessage(require("./twitch/plugins/on-message/user-log"))
  .onMessage(require("./twitch/plugins/on-message/user-badges"))
  .onMessage(require("./twitch/plugins/on-message/user-first-seen"))
  .onMessage(require("./twitch/plugins/on-message/user-rewards"))
  .onMessage(require("./twitch/plugins/on-message/terminal-chat"))
  .onMessage(require("./twitch/plugins/on-message/questions"))
  .onMessage(require("./twitch/plugins/on-message/ideas"))
  .onMessage(require("./twitch/plugins/on-message/wall-of-fame"))
  .onMessage(require("./twitch/plugins/on-message/streamer-highlight"))
  .onMessage(require("./twitch/plugins/on-message/commands"))
  .onMessage(require("./twitch/plugins/on-message/emit"))
  .onMessage(require("./twitch/plugins/on-message/user-last-seen"));
