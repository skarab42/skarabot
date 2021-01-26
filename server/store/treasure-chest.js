const create = require("./create");

const defaults = {
  position: { x: 0, y: 0 },
  points: 0,
  owner: null,
};

module.exports = create({ name: "treasure-chest", defaults });
