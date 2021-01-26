const {
  getViewerById,
  getFamouseViewers,
  updateViewer,
} = require("./libs/viewers");
const treasureStore = require("./store/treasure-chest");
const { getRanking } = require("./libs/teamRanking");
const { fetchViewers } = require("./libs/firebase");
const { getLastMessages } = require("./libs/chat");
const frameStore = require("./store/wall-frame");
const poll = require("./store/poll");

let io = null;

module.exports = ({ server, twitchClient } = {}) => {
  if (io) return io;

  io = require("socket.io")(server);

  io.on("connection", (socket) => {
    socket.on("wof.image-not-found", (id) => {
      updateViewer({ id, avatarURL: null });
    });

    socket.on("chat.get-last-messages", async (options, cb) => {
      let messages = await getLastMessages(options);
      const ids = messages.map((message) => message.viewer.id);
      const viewers = await fetchViewers(ids);
      messages = messages.map((message) => {
        const viewer = viewers[message.viewer.id];
        return !viewer
          ? message
          : {
              ...message,
              team: { name: viewer.team, color: viewer.color },
            };
      });
      cb(messages);
    });

    socket.on("team.getRanking", async (cb) => {
      cb(await getRanking());
    });

    socket.on("viewers.get-famouses", async (options, cb) => {
      cb(await getFamouseViewers(options));
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

    socket.on("poll.state", async (cb) => {
      cb(poll.store);
    });

    socket.on("treasureChest.getOwner", async (cb) => {
      const ownerId = treasureStore.get("owner");
      cb(await getViewerById(ownerId));
    });
  });

  return io;
};
