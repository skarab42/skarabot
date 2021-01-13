const poll = require("../../../store/poll");

module.exports = ({ message, client }, next) => {
  const viewer = message.data.viewer;
  const text = message.message;
  const prefix = text[0];

  if (!poll.get(`started`) || !["+", "-"].includes(prefix) || text.length < 2) {
    return next();
  }

  let [name] = text.slice(1).split(/[ \.]/);
  name = name.trim().toUpperCase().slice(0, 42);

  if (!name) return next();

  const lastItem = poll.get(`logs.${viewer.id}`);

  if (lastItem === name) return next();

  poll.set(`logs.${viewer.id}`, name);

  let points = poll.get(`items.${name}`) || 0;
  points += prefix === "+" ? 1 : -1;

  poll.set(`items.${name}`, points);

  client.emit("poll.update", { ...poll.store, currentItem: { name, points } });

  next();
};
