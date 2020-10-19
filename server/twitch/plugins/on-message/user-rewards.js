const usersStore = require("../../../store/users");
const users = require("../../../libs/users");
const soundex = require("soundex");

const messageLengthRatio = 0.01;
const welcomePoints = 10;
const replyPoints = 10;

const welcomeSentenses = require("./config/welcomeSentenses").map(s =>
  soundex(s)
);

module.exports = async ({ message, client }, next) => {
  let user = message.data.user;
  let points = message.message.length * messageLengthRatio;

  if (message.msg._tags["reply-parent-user-id"]) {
    points += replyPoints;
  }

  const firstWord = soundex(message.message.split(" ")[0].toLowerCase());

  const channel = message.channel.slice(1);
  const stream = await client.api.helix.streams.getStreamByUserName(channel);
  const startedAt = stream._data["started_at"];

  const gmt = Math.abs(new Date().getTimezoneOffset()) * 60;
  const startTime = new Date(startedAt).getTime() + gmt;
  const firstSeen = user.lastSeen < startTime;

  if (welcomeSentenses.includes(firstWord)) {
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
