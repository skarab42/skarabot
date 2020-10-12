const { name, version } = require("../package.json");
const polka = require("polka");
const sirv = require("sirv");

const port = 4224;
const host = "localhost";
const address = `${host}:${port}`;
const public = sirv("public", { dev: true });
const redirectURL = `http://${address}/token`;

polka()
  .use(public)
  .listen(port, err => {
    if (err) throw err;
    console.log(`> ${name} v${version}`);
    console.log(`> running on ${address}`);
  });
