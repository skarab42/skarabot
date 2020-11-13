const { name } = require("../../../../../package");
const envPaths = require("env-paths");
const fs = require("fs-extra");
const path = require("path");

const userDir = envPaths(name).data;
const downloadDir = path.join(userDir, "download");

fs.ensureDirSync(downloadDir);

module.exports = {
  userDir,
  downloadDir,
  allowedExtensions: ["mp3", "wav", "ogg"],
};
