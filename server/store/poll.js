const create = require("./create");

const defaults = {
  includes: null,
  started: false,
  items: {},
};

module.exports = create({ name: "poll", defaults });
