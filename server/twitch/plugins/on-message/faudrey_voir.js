const clips = {
  faudrey_voir: {
    id: "IntelligentArtisticWatermelonFunRun",
    channel: "faudrey_voir",
    duration: 15, // seconds
  },
};

module.exports = async ({ message, client }, next) => {
  const user = message.data.user;

  if (message.data.startTime < user.lastSeen) {
    return next();
  }

  const name = user.name.toLowerCase();
  const clip = clips[name];

  if (clip) {
    client.io.emit("faudrey_voir", { name, clip });
  }

  next();
};
