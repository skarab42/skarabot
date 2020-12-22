const users = require("../../../libs/users");
const { updateViewer, getViewerById } = require('../../../libs/viewers');

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

async function updateUser({ helixUser, client }) {
  const { _data } = helixUser;
  const id = _data["id"];

  let avatarURL = _data["profile_image_url"] || null;

  if (avatarURL && avatarURL.includes("/user-default-pictures-uv/")) {
    avatarURL = null;
  }

  if (avatarURL) {
    avatarURL = avatarURL.split('/').pop();
  }

  const viewCount = _data["view_count"] || 0;
  const user = users.update({ id, avatarURL, viewCount });

  await updateViewer({ id, avatarURL, viewCount });
  const viewer = await getViewerById(id);

  avatarURL && client.io.emit("wof.add-user", user);
  viewer && client.io.emit("viewers.update", viewer);
}

function processQueue(client) {
  client.api.helix.users
    .getUsersByIds([...usersQueue.keys()])
    .then((helixUsers) =>
      helixUsers.forEach((helixUser) => updateUser({ helixUser, client }))
    )
    .catch(error)
    .then(clearQueue);
}

module.exports = ({ message, client }, next) => {
  const { user } = message.data;

  if (message.data.startTime < user.lastSeen) {
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
