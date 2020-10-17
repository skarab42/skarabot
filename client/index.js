const socket = require("socket.io-client")();

const userIds = [];

socket.on("twitch.chat.onMessage", ({ channel, user, message, data, msg }) => {
  const userId = msg._tags["user-id"];
  console.log(data);
  if (!userIds.includes(userId)) {
    console.log("add user:", userId);
    userIds.push(userId);
    socket.emit(
      "twitch.api",
      "users",
      "getUserById",
      userId,
      ({ data, error }) => {
        const profileURL = data["profile_image_url"];
        const displayName = data["display_name"];
        console.log(displayName, profileURL);
      }
    );
  }
});
