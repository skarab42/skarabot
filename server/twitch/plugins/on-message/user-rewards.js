const users = require("../../../libs/users");
const soundex = require("soundex");

const messageLengthRatio = 0.01;
const welcomePoints = 10;
const replyPoints = 10;

const welcomeSentenses = require("./config/welcomeSentenses").map(s =>
  soundex(s)
);

module.exports = ({ message }, next) => {
  let user = message.data.user;
  let points = message.message.length * messageLengthRatio;

  if (message.msg._tags["reply-parent-user-id"]) {
    points += replyPoints;
  }

  const firstWord = soundex(message.message.split(" ")[0].toLowerCase());

  if (welcomeSentenses.includes(firstWord)) {
    points += welcomePoints;
  }

  user.points += points;
  users.update(user);

  next();
};
