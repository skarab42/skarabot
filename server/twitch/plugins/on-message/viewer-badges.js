module.exports = async ({ message }, next) => {
  const badges = message.msg._tags.badges || null;
  const viewer = message.data.viewer;

  if (!badges) return next();

  const newBadges = {};

  badges.split(",").forEach((badge) => {
    const [key, val] = badge.split("/");
    newBadges[key] = parseInt(val);
  });

  viewer.badges = newBadges;

  next();
};
