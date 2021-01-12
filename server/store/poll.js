const create = require("./create");

const defaults = {
  watching: false,
  started: false,
  items: {},
  logs: {},
};

module.exports = create({ name: "poll", defaults });
