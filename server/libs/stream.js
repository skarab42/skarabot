const { twitchClient } = require("../twitch");
const { twitch } = require("../config");

let startTime = 0;

async function getStartTime() {
  if (startTime) return startTime;

  const channel = twitch.channels[0];
  const stream = await twitchClient.api.helix.streams.getStreamByUserName(
    channel
  );

  if (stream) {
    const startedAt = stream._data["started_at"];
    const gmt = Math.abs(new Date().getTimezoneOffset()) * 60;
    startTime = new Date(startedAt).getTime() + gmt;
  }

  return startTime;
}

module.exports = {
  getStartTime,
};
