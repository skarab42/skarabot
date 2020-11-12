const users = require("./libs/users");
const logs = require("./libs/logs");

module.exports = (server) => {
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    socket.on("wof.image-not-found", (userId) => {
      const user = users.get(userId);
      user.avatarURL = null;
      users.update(user);
    });

    socket.on("logs.remove", (id) => {
      socket.emit("logs.update", logs.delete(id));
    });
  });

  return io;
};
