// 1h00m00s -> 3600000
// 30m00s   -> 1800000
// 60s      -> 60000
function humanTimeToTimestamp(input) {
  const matches = input.match(/([0-9]+h)?([0-9]+m)?([0-9]+s)/);
  if (!matches) return false;
  let [h, m, timestamp] = matches.slice(1, 4).map((i) => parseInt(i));
  !isNaN(h) && (timestamp += h * 3600);
  !isNaN(m) && (timestamp += m * 60);
  return timestamp;
}

function shuffle(o) {
  for (
    var j, x, i = o.length;
    i;
    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
}

async function isMatureChannel({ client, id }) {
  const channel = await client.api.kraken.channels.getChannel(id);
  return channel ? channel._data.mature : null;
}

async function getVideosByUserName({ client, name, mature = false }) {
  const id = await client.api.helix.users.getUserByName(name);
  const { data } = await client.api.helix.videos.getVideosByUser(id);
  if (!data.length) return null;
  if (!mature && (await isMatureChannel({ client, id }))) return null;
  return data.map((d) => d._data);
}

async function getVideoByUserName({ client, name, channel, mature = false }) {
  const videos = await getVideosByUserName({ client, name, mature });
  if (!videos) return null;
  let { id, duration } = shuffle(videos)[0];
  duration = humanTimeToTimestamp(duration);
  return { id, user: { name }, channel, duration };
}

module.exports = {
  shuffle,
  getVideoByUserName,
  humanTimeToTimestamp,
};
