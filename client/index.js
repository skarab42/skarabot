const socket = require("socket.io-client")();

socket.on("twitch.chat.onMessage", chatMessage => {
  console.log("onMessage:", chatMessage);
});
