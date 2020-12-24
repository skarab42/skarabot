const cooldownIds = {};

module.exports = function cooldown(client, message, id, seconds = 1) {
  const viewer = message.data.viewer;

  if (viewer.badges.broadcaster || viewer.badges.moderator) {
    return false;
  }

  const now = Date.now();
  const timeout = seconds * 1000;
  const elapsed = now - (cooldownIds[id] || 0);

  if (elapsed < timeout) {
    let cmd = id;
    const rest = parseInt((timeout - elapsed) / 1000);
    if (cmd.startsWith("cmd.")) cmd = cmd.slice(4);
    client.chat.say(message.channel, `!${cmd} cooldown (~${rest}s)`);
    return true;
  }

  cooldownIds[id] = now;
  return false;
};
