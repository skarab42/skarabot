const poll = require("../../../store/poll");

module.exports = ({ message, client }, next) => {
  const text = message.message;
  const prefix = text[0];

  if (!poll.get(`started`) || !["+", "-"].includes(prefix) || text.length < 2) {
    return next();
  }

  let [name] = text.slice(1).split(" ");
  name = name.trim().toUpperCase().slice(0, 42);

  const includes = poll.get(`includes`);

  if (!name || (includes && !includes.includes(name))) {
    return next();
  }

  let points = poll.get(`items.${name}`) || 0;
  points += prefix === "+" ? 1 : -1;

  poll.set(`items.${name}`, points);
  client.emit("poll.new-item", { name, points });

  next();
};
