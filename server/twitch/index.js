const open = require("open");
const { ApiClient } = require("twitch");
const { StaticAuthProvider } = require("twitch-auth");

const authBaseURL = "https://id.twitch.tv/oauth2/authorize?response_type=token";
const accessToken = "";

let state = {
  clientId: null,
  redirectURI: "http://localhost",
  forceVerify: false,
  scopes: []
};

function getAuthUrl(scopes) {
  const redir = encodeURIComponent(state.redirectURI);
  return (
    `${authBaseURL}&client_id=${state.clientId}` +
    `&redirect_uri=${redir}&scope=${scopes.join(" ")}` +
    `&force_verify=${state.forceVerify ? "true" : "false"}`
  );
}

async function connect(config) {
  state = { ...state, ...config };
  const url = getAuthUrl(config.scopes);
  console.log("Connecting to Twitch...");
  open(url);
}

function token(req, res) {
  res.end(`
    <script>
      window.location = 'login?' + window.location.hash.slice(1);
    </script>
  `);
}

function login(req, res) {
  res.end(`<script>window.close()</script>`);
  console.log(req.query);
}

module.exports = {
  connect,
  token,
  login
};
