const create = require("./create");

const defaults = {
  logs: [],
};

module.exports = create({ name: "logs", defaults });
