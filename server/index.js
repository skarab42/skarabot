const { name, version } = require("../package.json");
const TwitchClient = require("./twitch/Client");
const config = require("./config");
const io = require("socket.io");
const polka = require("polka");
const sirv = require("sirv");

const twitchClient = new TwitchClient(config.twitch);
const twitchAuth = twitchClient.auth.bind(twitchClient);
const public = sirv(config.server.publicPath, { dev: true });

const { server } = polka()
  .use(public)
  .use(twitchAuth)
  .listen(config.server.port, async err => {
    if (err) throw err;
    console.log(`> ${name} v${version}`);
    console.log(`> running on ${config.server.address}`);
  });

twitchClient
  .setSocketIO(io(server))
  .onMessage(require("./twitch/plugins/on-message/timestamp"))
  .onMessage(require("./twitch/plugins/on-message/users-log"))
  .onMessage(require("./twitch/plugins/on-message/user-first-seen"))
  .onMessage(require("./twitch/plugins/on-message/user-rewards"))
  .onMessage(require("./twitch/plugins/on-message/emit"))
  .onMessage(require("./twitch/plugins/on-message/user-last-seen"));
