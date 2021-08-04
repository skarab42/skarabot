const { ApiClient } = require("twitch");
const AuthProvider = require("./AuthProvider");
const { ChatClient } = require("twitch-chat-client");

const rolesPlugin = require("./plugins/roles");
const cooldownPlugin = require("./plugins/cooldown");

module.exports = class Client {
  constructor(config) {
    this.config = config;

    this.authProvider = new AuthProvider(config);
    this.api = new ApiClient({ authProvider: this.authProvider });
    this.chat = new ChatClient(this.authProvider, {
      channels: config.channels,
    });

    this.io = null;
    this.chat.connect();
    this.onMessageCallbacks = [];

    this.chat.onMessage(async (channel, user, message, msg) => {
      const emotes = msg.parseEmotes();

      message = { channel, user, message, emotes, msg, data: {} };
      message.msg._tags = Object.fromEntries(msg._tags || []);

      const isModo = rolesPlugin.isModo.bind(null, this, message);
      const isVip = rolesPlugin.isVip.bind(null, this, message);
      const cooldown = cooldownPlugin.bind(null, this, message);

      this._onMessage({ message, client: this, cooldown, isModo, isVip });
    });
  }

  emit(eventName, ...args) {
    this.io && this.io.emit(eventName, ...args);
  }

  _onMessage(message) {
    let i = 0;
    const fn = this.onMessageCallbacks[i];
    const next = () => {
      const nextFn = this.onMessageCallbacks[++i];
      nextFn && nextFn(message, next);
    };
    fn(message, next);
  }

  onMessage(fn) {
    this.onMessageCallbacks.push(fn);
    return this;
  }

  // TODO print/log error
  onApiError(api, error) {
    // eslint-disable-next-line no-console
    console.error(`${api}:`, error);
  }

  setSocketIO(io) {
    this.io = io;
    this.io.on("connection", (socket) => {
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
        } catch (error) {
          this.onApiError(label, error);
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
      let argv = (args || "").split(",").map((arg) => arg.trim());
      const response = await this.api.helix[api][call](argv);
      const json = JSON.stringify(response._data || response);
      res.end(json);
    }
    next();
  }
};
