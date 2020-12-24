const clips = {
  faudrey_voir: {
    id: "IntelligentArtisticWatermelonFunRun",
    channel: "faudrey_voir",
    duration: 15, // seconds
  },
};

module.exports = async ({ message, client }, next) => {
  const viewer = message.data.viewer;

  if (!message.data.isFirstMessage) {
    return next();
  }

  const name = viewer.name.toLowerCase();
  const clip = clips[name];

  if (clip) {
    client.io.emit("faudrey_voir", { name, clip });
  }

  next();
};
