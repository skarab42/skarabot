const { getLastMessages } = require("./libs/chat");
const frameStore = require("./store/wall-frame");
const users = require("./libs/users");

module.exports = ({ server, twitchClient }) => {
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    socket.on("wof.image-not-found", (userId) => {
      const user = users.get(userId);
      user.avatarURL = null;
      users.update(user);
    });

    socket.on("chat.get-last-messages", async (options, cb) => {
      cb(await getLastMessages(options))
    });

    socket.on("video-play", ({ user, channel }) => {
      twitchClient.chat.say(channel, `Vous regardez twitch.tv/${user.name}`);
    });

    socket.on("frame.handles.coords", (coords) => {
      frameStore.set("coords", coords);
      socket.broadcast.emit("frame.handles.coords", coords);
    });

    socket.on("frame.handles.getCoords", () => {
      socket.emit("frame.handles.coords", frameStore.get("coords"));
    });
  });

  return io;
};
