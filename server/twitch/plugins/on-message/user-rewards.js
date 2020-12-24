const soundex = require("soundex");

const messageLengthRatio = 0.01;
const welcomePoints = 10;
const replyPoints = 5;

const welcomeSentences = require("./config/welcomeSentences").map((s) =>
  soundex(s)
);

module.exports = ({ message }, next) => {
  let viewer = message.data.viewer;
  let points = message.message.length * messageLengthRatio;

  if (message.msg._tags["reply-parent-user-id"]) {
    points += replyPoints;
  }

  const firstWord = soundex(message.message.split(" ")[0].toLowerCase());

  if (welcomeSentences.includes(firstWord)) {
    if (message.data.isFirstMessage) {
      points += welcomePoints;
    } else {
      points += welcomePoints * 0.1;
    }
  }

  viewer.points = Math.ceil(viewer.points + points);

  next();
};
