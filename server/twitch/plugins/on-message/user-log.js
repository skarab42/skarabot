const { addViewer, getViewerById } = require('../../../libs/viewers');
const users = require("../../../libs/users");

module.exports = async ({ message }, next) => {
  const { msg } = message;
  const id = msg._tags["user-id"];

  let user = users.get(id);
  let viewerModel = await getViewerById(id);

  if (!viewerModel) {
    const { timestamp } = message.data;
    const name = msg._tags["display-name"];
    addViewer({ id, name });
    user = users.set(id, users.create({ id, name, firstSeen: timestamp }));
  } else {
    user = users.update({ id, messageCount: user.messageCount + 1 });
  }

  message.data.user = user;

  next();
};
