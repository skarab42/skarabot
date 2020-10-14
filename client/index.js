const socket = require("socket.io-client")();

socket.on("twitch.chat.onPrivmsg", payload => {
  console.log("onPrivmsg", payload);
  console.log(`${payload.channel} <${payload.user}> ${payload.message}`);
  if (payload.message === "ping") {
    socket.emit("twitch.chat.say", payload.channel, "pong");
  }
});

socket.emit("twitch.api", "users", "getMe", true, (...args) => {
  console.log({ args });
});

// fetch("twitch?api=users&call=getMe&args=true")
//   .then(response => {
//     return response.json();
//   })
//   .then(json => {
//     console.log({ json });
//   })
//   .catch(error => {
//     console.error(error);
//   });
