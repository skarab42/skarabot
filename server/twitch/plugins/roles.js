const defaultOptions = {
  silent: false,
};

function is(roles, client, message, options = {}) {
  options = { ...defaultOptions, ...options };
  const viewer = message.data.viewer;
  const found = roles.filter((role) => viewer.badges[role]);

  if (found.length) {
    return true;
  }

  if (!options.silent) {
    client.chat.say(
      message.channel,
      `Usage: pas pour toi ${viewer.name} Kappa`
    );
  }

  return false;
}

module.exports = {
  isVip: is.bind(null, ["broadcaster", "moderator", "vip"]),
  isModo: is.bind(null, ["broadcaster", "moderator"]),
  isBroadcaster: is.bind(null, ["broadcaster"]),
};
