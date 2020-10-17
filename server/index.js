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

function parseBadges(chatMessage, next) {
  const badgesStr = chatMessage.msg._tags.badges || "";
  const badges = badgesStr.split(",").map(b => {
    let [key, val] = b.split("/");
    return [key, parseInt(val)];
  });
  chatMessage.data.badges = Object.fromEntries(badges);
  next();
}

twitchClient
  .setSocketIO(io(server))
  .onMessage(parseBadges)
  .onMessage((chatMessage, next) => {
    chatMessage.data.say = "kapoué";
    next();
  });
