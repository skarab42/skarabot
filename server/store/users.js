const create = require("./create");

const defaults = {
  channels: [],
};

module.exports = create({ name: "users", defaults });
