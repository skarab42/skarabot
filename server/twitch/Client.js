const AuthProvider = require("./AuthProvider");
const { ApiClient } = require("twitch");

module.exports = class Client {
  constructor(config) {
    this.config = config;
    this.authProvider = new AuthProvider(config);
    this.api = new ApiClient({ authProvider: this.authProvider });
  }

  async auth(req, res, next) {
    if (req.path === "/token") {
      res.end(`
        <script>
          window.location = '/token/set?' + window.location.hash.slice(1);
        </script>
      `);
    } else if (req.path === "/token/set") {
      res.end(`
        <h1>Done! You can close this window :)</h1>
        <script>window.close()</script>
        <script>window.location = '/'</script>
      `);
      this.authProvider.setToken(req.query);
    } else if (req.path === "/twitch") {
      const { api, call, args } = req.query;
      let argv = (args || "").split(",").map(arg => args.trim());
      const response = await this.api.helix[api][call](argv);
      const json = JSON.stringify(response._data || response);
      res.end(json);
    }
    next();
  }
};
