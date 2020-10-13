const AuthProvider = require("./AuthProvider");
const { ApiClient } = require("twitch");

module.exports = class Client {
  constructor(config) {
    this.config = config;
    this.authProvider = new AuthProvider(config);
    this.api = new ApiClient({ authProvider: this.authProvider });
  }

  auth(req, res, next) {
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
    }
    next();
  }
};
