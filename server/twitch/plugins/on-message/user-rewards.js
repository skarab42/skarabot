const users = require("../../../libs/users");
const soundex = require("soundex");

const messageLengthRatio = 0.01;
const welcomePoints = 10;
const replyPoints = 10;

const welcomeSentences = require("./config/welcomeSentences").map(s =>
  soundex(s)
);

module.exports = ({ message }, next) => {
  let user = message.data.user;
  let points = message.message.length * messageLengthRatio;

  if (message.msg._tags["reply-parent-user-id"]) {
    points += replyPoints;
  }

  const firstWord = soundex(message.message.split(" ")[0].toLowerCase());
  const firstSeen = user.lastSeen < message.data.startTime;

  if (welcomeSentences.includes(firstWord)) {
    if (firstSeen) {
      points += welcomePoints;
    } else {
      points += welcomePoints * 0.1;
    }
  }

  user.points += points;
  users.update(user);

  next();
};
