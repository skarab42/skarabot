// 1h00m00s -> 3600000
// 30m00s   -> 1800000
// 60s      -> 60000
exports.humanTimeToTimestamp = function (input) {
  const matches = input.match(/([0-9]+h)?([0-9]+m)?([0-9]+s)/);
  if (!matches) return false;
  let [h, m, timestamp] = matches.slice(1, 4).map((i) => parseInt(i));
  !isNaN(h) && (timestamp += h * 3600);
  !isNaN(m) && (timestamp += m * 60);
  return timestamp;
};

exports.shuffle = function (o) {
  for (
    var j, x, i = o.length;
    i;
    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
};
