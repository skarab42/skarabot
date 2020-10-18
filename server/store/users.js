const create = require("./create");

const defaults = {
  list: {}
};

module.exports = create({ name: "users", defaults });
