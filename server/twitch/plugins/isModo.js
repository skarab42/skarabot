const defaultOptions = {
  silent: false,
};

module.exports = function isModo(client, message, options = {}) {
  options = { ...defaultOptions, ...options };
  const viewer = message.data.viewer;

  if (viewer.badges.broadcaster || viewer.badges.moderator) {
    return true;
  }

  if (!options.silent) {
    client.chat.say(
      message.channel,
      `Usage: pas pour toi ${viewer.name} Kappa`
    );
  }

  return false;
};
