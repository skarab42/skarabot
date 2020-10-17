const AuthProvider = require("./AuthProvider");
const { ApiClient } = require("twitch");
const { ChatClient } = require("twitch-chat-client");

module.exports = class Client {
  constructor(config) {
    this.config = config;
    this.authProvider = new AuthProvider(config);
    this.api = new ApiClient({ authProvider: this.authProvider });
    this.chat = new ChatClient(this.authProvider, {
      channels: config.channels
    });
    this.io = null;
    this.chat.connect();
    this.chat.onMessage(async (channel, user, message, msg) => {
      msg._tags = Object.fromEntries(msg._tags || []);
      this._onMessage({ channel, user, message, data: {}, msg });
    });
  }

  emit(eventName, ...args) {
    this.io && this.io.emit(eventName, ...args);
  }

  _onMessage(message) {
    this.emit("twitch.chat.onMessage", message);
  }

  onMessage(fn) {
    const next = this._onMessage;
    const thisFn = fn.bind(this);
    this._onMessage = message => thisFn(message, next.bind(this, message));
    return this;
  }

  setSocketIO(io) {
    this.io = io;
    this.io.on("connection", socket => {
      socket.on("twitch.chat.say", (channel, message) => {
        this.chat.say(channel, message);
      });
      socket.on("twitch.api", async (api, method, ...args) => {
        let cb = null;

        if (typeof args[args.length - 1] === "function") {
          cb = args.pop();
        }

        const label = `twitch.helix.${api}.${method}`;

        try {
          const ret = await this.api.helix[api][method](...args);
          cb && cb({ error: null, data: ret._data });
          console.log(`>>> ${label}:`, ret);
        } catch (error) {
          console.error(`!!! ${label}:`, error);
          cb && cb({ error, data: null });
        }
      });
    });
    return this;
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
