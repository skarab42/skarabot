const { addViewer, getViewerById } = require("../../../libs/viewers");

module.exports = async ({ message }, next) => {
  const { msg, data } = message;
  const id = parseInt(msg._tags["user-id"]);

  data.viewer = await getViewerById(id);

  if (!data.viewer) {
    data.viewer = await addViewer({ id, name: msg._tags["display-name"] });
  }

  data.viewer.messageCount++;

  next();
};
