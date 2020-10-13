const { name, version } = require("../package.json");
const TwitchClient = require("./twitch/Client");
const polka = require("polka");
const sirv = require("sirv");

const port = 4224;
const host = "localhost";
const address = `${host}:${port}`;
const public = sirv("public", { dev: true });

const twitchConfig = {
  clientId: "i1zqws5ibrt0vdaiuenhcpoe4t5rnb",
  redirectURI: `http://${address}/token`,
  forceVerify: true
};

const twitchClient = new TwitchClient(twitchConfig);
const twitchAuth = twitchClient.auth.bind(twitchClient);

polka()
  .use(public)
  .use(twitchAuth)
  .listen(port, async err => {
    if (err) throw err;
    console.log(`> ${name} v${version}`);
    console.log(`> running on ${address}`);
    const me = await twitchClient.api.helix.users.getMe();
    console.log(me);
  });
