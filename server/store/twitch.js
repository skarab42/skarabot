const create = require("./create");

const defaults = {
  accessToken: null,
};

module.exports = create({ name: "twitch", defaults });
