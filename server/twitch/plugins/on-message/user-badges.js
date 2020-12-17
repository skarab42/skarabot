const users = require("../../../libs/users");

module.exports = ({ message }, next) => {
  const badges = message.msg._tags.badges || null;
  const user = message.data.user;

  message.data.badges = {};

  if (!badges) {
    return next();
  }

  badges.split(",").forEach((badge) => {
    const [key, val] = badge.split("/");
    message.data.badges[key] = parseInt(val);
  });

  user.badges = message.data.badges;
  users.update(user);

  next();
};
