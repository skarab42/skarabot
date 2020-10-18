const Conf = require("conf");
const path = require("path");

module.exports = function create({ name, ...options }) {
  return new Conf({ ...options, configName: name });
};
