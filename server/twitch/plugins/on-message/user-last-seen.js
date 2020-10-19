const users = require("../../../libs/users");

module.exports = ({ message }, next) => {
  message.data.user.lastSeen = message.data.timestamp;
  users.update(message.data.user);
  next();
};
