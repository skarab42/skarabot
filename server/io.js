const users = require("./libs/users");

module.exports = server => {
  const io = require("socket.io")(server);

  io.on("connection", socket => {
    socket.on("wof.image-not-found", userId => {
      const user = users.get(userId);
      user.avatarURL = null;
      users.update(user);
    });
  });

  return io;
};
