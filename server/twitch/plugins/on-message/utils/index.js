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

async function getChannel({ client, user }) {
  return await client.api.kraken.channels.getChannel(user);
}

async function getChannelByName({ client, name }) {
  const user = await getUserByName({ client, name });
  return await getChannel({ client, user });
}

async function isMatureChannel({ client, user }) {
  const channel = await getChannel({ client, user });
  return channel ? channel._data.mature : null;
}

async function getUserByName({ client, name }) {
  return await client.api.helix.users.getUserByName(name);
}

async function getVideosByUser({ client, user }) {
  return await client.api.helix.videos.getVideosByUser(user);
}

async function getStreamByUserName({ client, name }) {
  return await client.api.helix.streams.getStreamByUserName(name);
}

async function getVideosByUserName({ client, name, mature = false }) {
  const user = await getUserByName({ client, name });
  const { data } = await getVideosByUser({ client, user });
  if (!data.length) return null;
  if (!mature && (await isMatureChannel({ client, user }))) return null;
  return data.map((d) => d._data);
}

async function getRandomVideoByUserName({
  client,
  name,
  channel,
  mature = false,
}) {
  const videos = await getVideosByUserName({ client, name, mature });
  if (!videos) return null;
  let { id, duration } = shuffle(videos)[0];
  duration = humanTimeToTimestamp(duration);
  return { id, user: { name }, channel, duration };
}

module.exports = {
  shuffle,
  getChannel,
  getChannelByName,
  getStreamByUserName,
  getUserByName,
  getVideosByUser,
  getRandomVideoByUserName,
  humanTimeToTimestamp,
};
