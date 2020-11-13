const { name } = require("../package");
const envPaths = require("env-paths");

const port = 4224;
const host = "localhost";
const address = `${host}:${port}`;
const userDir = envPaths(name).data;

module.exports = {
  server: {
    host,
    port,
    address,
    userDir,
    publicPath: "public",
  },
  twitch: {
    clientId: "i1zqws5ibrt0vdaiuenhcpoe4t5rnb",
    redirectURI: `http://${address}/token`,
    forceVerify: false,
    channels: ["skarab42"],
  },
};
