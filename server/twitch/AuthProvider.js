const open = require("open");
const EventEmitter = require("events");
const { AccessToken } = require("twitch");

const authBaseURL = "https://id.twitch.tv/oauth2/authorize?response_type=token";

function normalizeScopes(scopes) {
  if (typeof scopes === "string") {
    scopes = [scopes];
  } else if (!scopes) {
    scopes = [];
  }
  return scopes;
}

module.exports = class AuthProvider extends EventEmitter {
  constructor({
    clientId,
    redirectURI = "http://localhost",
    forceVerify = false,
  } = {}) {
    super();

    this.clientId = clientId;
    this.redirectURI = redirectURI;
    this.forceVerify = forceVerify;

    this.tokenType = "user";
    this.accessToken = null;
    this.currentScopes = [];

    this.__resolve = null;
  }

  hasScopes(scopes) {
    return scopes.every((scope) => this.currentScopes.includes(scope));
  }

  getAuthUrl(scopes) {
    const redir = encodeURIComponent(this.redirectURI);
    return (
      `${authBaseURL}&client_id=${this.clientId}` +
      `&redirect_uri=${redir}&scope=${scopes.join(" ")}` +
      `&force_verify=${this.forceVerify ? "true" : "false"}`
    );
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

  setToken({ access_token }) {
    this.__resolve && this.__resolve(access_token);
  }

  getAccessToken(scopes = null) {
    // TODO detect and reject promise on error
    return new Promise((resolve) => {
      scopes = normalizeScopes(scopes);

      // eslint-disable-next-line no-console
      console.log("\x1b[35m%s\x1b[0m", `Twitch request scopes [${scopes}]`);

      if (!this.forceVerify && this.accessToken && this.hasScopes(scopes)) {
        return resolve(this.accessToken);
      }

      this.__resolve = (accessToken) => {
        scopes.forEach((scope) => this.currentScopes.push(scope));

        this.accessToken = new AccessToken({
          access_token: accessToken,
          scope: this.currentScopes,
          refresh_token: "",
        });

        resolve(this.accessToken);
      };

      open(this.getAuthUrl(scopes));
    });
  }
};
