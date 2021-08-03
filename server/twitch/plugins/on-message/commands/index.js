const path = require("path");
const fs = require("fs");

const commands = {};

fs.readdirSync(__dirname).forEach((file) => {
  if (file === "index.js" || file.startsWith("_")) return;
  const command = path.basename(file, ".js");
  commands[command] = require(`./${command}`);
});

module.exports = commands;
