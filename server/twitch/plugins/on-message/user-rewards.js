const users = require("../../../libs/users");

const messageLengthRatio = 0.01;
const replyPoints = 10;

module.exports = ({ message }, next) => {
  let user = message.data.user;

  let points = message.message.length * messageLengthRatio;

  if (message.msg._tags["reply-parent-user-id"]) {
    points += replyPoints;
  }

  user.points += points;
  users.update(user);

  // console.log(message);

  next();
};
