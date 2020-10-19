const users = require("../../../libs/users");

let queueTimeoutId = null;
const queueTimeout = 5000;
const usersQueue = new Map();

function log(...args) {
  console.log("[users-log]", ...args);
}

function error(...args) {
  // TODO handle error....
  log("[error]", ...args);
}

function clearQueue() {
  log("clearQueue");
  usersQueue.clear();
  clearTimeout(queueTimeoutId);
  queueTimeoutId = null;
}

function updateUser(helixUser) {
  const { _data } = helixUser;
  const id = _data["id"];
  log("updateUser:", id);
  users.update({
    id,
    avatarURL: _data["profile_image_url"] || null,
    viewCount: _data["view_count"] || 0
  });
}

function processQueue(client) {
  log("processQueue:", usersQueue.size);
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
