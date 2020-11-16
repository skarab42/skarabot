const users = require("./libs/users");
const logs = require("./libs/logs");

module.exports = ({ server, twitchClient }) => {
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    socket.on("wof.image-not-found", (userId) => {
      const user = users.get(userId);
      user.avatarURL = null;
      users.update(user);
    });

    socket.on("logs.remove", (id) => {
      io.emit("logs.update", logs.delete(id));
    });

    socket.on("logs.filtersChange", (filters) => {
      socket.broadcast.emit("logs.filtersChange", filters);
    });

    socket.on("video-play", ({ user, channel }) => {
      twitchClient.chat.say(channel, `Vous regardez twitch.tv/${user.name}`);
    });
  });

  return io;
};
