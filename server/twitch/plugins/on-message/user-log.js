const users = require("../../../libs/users");

module.exports = ({ message }, next) => {
  const { msg } = message;
  const id = msg._tags["user-id"];

  let user = users.get(id);

  if (!user) {
    const { timestamp } = message.data;
    const name = msg._tags["display-name"];
    user = users.set(id, users.create({ id, name, firstSeen: timestamp }));
  } else {
    user = users.update({ id, messageCount: user.messageCount + 1 });
  }

  message.data.user = user;

  next();
};
