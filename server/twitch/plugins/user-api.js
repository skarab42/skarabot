const users = require("../../libs/users");

module.exports = function userAPI(req, res, next) {
  if (req.path === "/user") {
    res.end(JSON.stringify(users.get(req.query.id)));
  } else if (req.path === "/users") {
    res.end(JSON.stringify(users.getAll()));
  }

  next();
};
