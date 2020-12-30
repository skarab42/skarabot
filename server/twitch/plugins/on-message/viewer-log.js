const { addViewer, getViewerById } = require("../../../libs/viewers");
const { fetchViewer } = require("./../../../libs/firebase");

module.exports = async ({ message }, next) => {
  const { msg, data } = message;
  const id = parseInt(msg._tags["user-id"]);

  data.viewer = await getViewerById(id);
  data.color = null;
  data.team = null;

  if (!data.viewer) {
    data.viewer = await addViewer({ id, name: msg._tags["display-name"] });
  }

  let viewer = await fetchViewer(id);

  if (viewer) {
    data.team = {
      name: viewer.team,
      color: viewer.color,
    };
  }

  data.viewer.messageCount++;

  next();
};
