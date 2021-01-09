require("dotenv-flow").config();

const { twitchClient, twitchAuth } = require("./twitch");
const { name, version } = require("../package.json");
const firebase = require("./libs/firebase");
const localtunnel = require("localtunnel");
const umzug = require("./db/umzug");
const config = require("./config");
const socketIO = require("./io");
const polka = require("polka");
const sirv = require("sirv");

const userServ = sirv(config.server.userDir, { dev: true });
const publicServ = sirv(config.server.publicPath, { dev: true });

(async () => {
  await umzug.up();
  await localtunnel({
    subdomain: process.env.LOCALTUNEL_SUBDOMAIN,
    port: config.server.port,
  });

  const { server } = polka()
    .use(userServ)
    .use(publicServ)
    .use(twitchAuth)
    .get("/teamChange", firebase.onTeamChange)
    .listen(config.server.port, async (err) => {
      if (err) throw err;
      /* eslint-disable no-console */
      console.log(`> ${name} v${version}`);
      console.log(`> running on ${config.server.address}`);
      /* eslint-enable no-console */
    });

  twitchClient
    .setSocketIO(socketIO({ server, twitchClient }))
    .onMessage(require("./twitch/plugins/on-message/timestamp"))
    .onMessage(require("./twitch/plugins/on-message/start-time"))
    .onMessage(require("./twitch/plugins/on-message/viewer-log"))
    .onMessage(require("./twitch/plugins/on-message/viewer-badges"))
    .onMessage(require("./twitch/plugins/on-message/user-first-seen"))
    .onMessage(require("./twitch/plugins/on-message/user-rewards"))
    .onMessage(require("./twitch/plugins/on-message/terminal-chat"))
    .onMessage(require("./twitch/plugins/on-message/chat"))
    .onMessage(require("./twitch/plugins/on-message/poll"))
    .onMessage(require("./twitch/plugins/on-message/wall-of-fame"))
    .onMessage(require("./twitch/plugins/on-message/streamer-highlight"))
    .onMessage(require("./twitch/plugins/on-message/faudrey_voir"))
    .onMessage(require("./twitch/plugins/on-message/commands"))
    .onMessage(require("./twitch/plugins/on-message/viewer-save"));
})();
