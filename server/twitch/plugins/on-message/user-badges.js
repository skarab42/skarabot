module.exports = ({ message }, next) => {
  const badges = message.msg._tags.badges || null;
  message.data.badges = {};

  if (!badges) {
    return next();
  }

  badges.split(",").forEach((badge) => {
    const [key, val] = badge.split("/");
    message.data.badges[key] = parseInt(val);
  });

  next();
};
