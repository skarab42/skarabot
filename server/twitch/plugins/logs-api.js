const logs = require("../../libs/logs");

module.exports = function logsAPI(req, res, next) {
  if (req.path === "/logs-api") {
    res.end(JSON.stringify(logs.getAll()));
  }

  next();
};
