const users = require("../../../libs/users");

let queueTimeoutId = null;
const queueTimeout = 5000;
const usersQueue = new Map();

// TODO print/log error....
function error(...args) {
  // eslint-disable-next-line no-console
  console.error("[error]", ...args);
}

function clearQueue() {
  usersQueue.clear();
  clearTimeout(queueTimeoutId);
  queueTimeoutId = null;
}

function updateUser(helixUser) {
  const { _data } = helixUser;
  const id = _data["id"];
  users.update({
    id,
    avatarURL: _data["profile_image_url"] || null,
    viewCount: _data["view_count"] || 0
  });
}

function processQueue(client) {
  client.api.helix.users
    .getUsersByIds([...usersQueue.keys()])
    .then(helixUsers => helixUsers.forEach(updateUser))
    .catch(error)
    .then(clearQueue);
}

module.exports = ({ message, client }, next) => {
  const { user } = message.data;

  if (user.lastSeen !== 0) {
    return next();
  }

  if (!usersQueue.has(user.id)) {
    usersQueue.set(user.id, message);
  }

  if (!queueTimeoutId && usersQueue.size) {
    queueTimeoutId = setTimeout(processQueue.bind(null, client), queueTimeout);
  }

  next();
};
