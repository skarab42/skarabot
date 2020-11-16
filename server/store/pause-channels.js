const create = require("./create");

const defaults = {
  channels: [],
};

module.exports = create({ name: "pause-channels", defaults });
