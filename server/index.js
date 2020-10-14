const { name, version } = require("../package.json");
const TwitchClient = require("./twitch/Client");
const io = require("socket.io");
const polka = require("polka");
const sirv = require("sirv");

const port = 4224;
const host = "localhost";
const address = `${host}:${port}`;
const public = sirv("public", { dev: true });

const twitchConfig = {
  clientId: "i1zqws5ibrt0vdaiuenhcpoe4t5rnb",
  redirectURI: `http://${address}/token`,
  forceVerify: false,
  channels: ["fablab_onlfait"]
};

const twitchClient = new TwitchClient(twitchConfig);
const twitchAuth = twitchClient.auth.bind(twitchClient);

const { server } = polka()
  .use(public)
  .use(twitchAuth)
  .listen(port, async err => {
    if (err) throw err;
    console.log(`> ${name} v${version}`);
    console.log(`> running on ${address}`);
  });

twitchClient.setSocketIO(io(server));
