const port = 4224;
const host = "localhost";
const address = `${host}:${port}`;

module.exports = {
  server: {
    host,
    port,
    address,
    publicPath: "public"
  },
  twitch: {
    clientId: "i1zqws5ibrt0vdaiuenhcpoe4t5rnb",
    redirectURI: `http://${address}/token`,
    forceVerify: false,
    channels: ["skarab42"] //, "xqcow"
  }
};
