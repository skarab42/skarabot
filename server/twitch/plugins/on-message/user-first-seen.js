const { screenLimit } = require("./config/wall-of-fame");
const { random } = require("./utils");

function setRandomPosition(viewer) {
  viewer.position = {
    x: random(0, screenLimit.x),
    y: random(0, screenLimit.y),
  };
}

let queueTimeoutId = null;
const queueTimeout = 2000;
const viewerQueue = new Map();

// TODO print/log error....
function error(...args) {
  // eslint-disable-next-line no-console
  console.error("[error]", ...args);
}

function clearQueue() {
  viewerQueue.clear();
  clearTimeout(queueTimeoutId);
  queueTimeoutId = null;
}

async function updateUser({ helixUser, client }) {
  const { _data } = helixUser;
  const id = parseInt(_data["id"]);
  const { data } = viewerQueue.get(id);
  const viewer = data.viewer;

  let avatarURL = _data["profile_image_url"] || null;

  if (avatarURL && avatarURL.includes("/user-default-pictures-uv/")) {
    avatarURL = null;
  }

  if (avatarURL) {
    avatarURL = avatarURL.split("/").pop();
  }

  const viewCount = _data["view_count"] || 0;

  viewer.avatarURL = avatarURL;
  viewer.viewCount = viewCount;

  await viewer.save();

  client.io.emit("viewers.update", viewer);

  return data;
}

function processQueue(client) {
  const ids = [...viewerQueue.keys()];

  client.api.helix.users
    .getUsersByIds(ids)
    .then((helixUsers) =>
      Promise.all(
        helixUsers.map((helixUser) => updateUser({ helixUser, client }))
      )
        .then((viewers) => {
          return viewers
            .filter(({ isFirstMessage, viewer }) => {
              if (viewer.messageCount === 1) {
                setRandomPosition(viewer);
                viewer.save();
              }
              return isFirstMessage || viewer.messageCount === 1;
            })
            .map((v) => v.viewer);
        })
        .then((viewers) => {
          client.emit("wof.add-viewers", viewers);
        })
    )
    .catch(error)
    .then(clearQueue);
}

module.exports = ({ message, client }, next) => {
  const viewer = message.data.viewer;

  const updatedAt = new Date(viewer.updatedAt).getTime();
  message.data.isFirstMessage = message.data.startTime > updatedAt;

  if (viewer.messageCount > 1 && !message.data.isFirstMessage) {
    return next();
  }

  if (!viewerQueue.has(viewer.id)) {
    viewerQueue.set(viewer.id, message);
  }

  if (!queueTimeoutId && viewerQueue.size) {
    queueTimeoutId = setTimeout(processQueue.bind(null, client), queueTimeout);
  }

  next();
};
