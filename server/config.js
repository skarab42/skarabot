const { name } = require("../package");
const envPaths = require("env-paths");
const path = require('path');

const port = 4224;
const host = "localhost";
const address = `${host}:${port}`;
const userDir = envPaths(name).data;

const watch = process.argv.includes("--watch") || process.argv.includes("-w");

module.exports = {
  watch,
  server: {
    host,
    port,
    address,
    userDir,
    publicPath: "public",
  },
  db: {
    dialect: "sqlite",
    storage: path.join(userDir, 'db.sqlite'),
    logging: false, // watch ? console.log : false,
  },
  twitch: {
    clientId: "i1zqws5ibrt0vdaiuenhcpoe4t5rnb",
    redirectURI: `http://${address}/token`,
    forceVerify: false,
    channels: ["skarab42"],
  },
};
