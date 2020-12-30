const socket = require("socket.io-client")();

socket.on("team.ranking", (ranking) => {
  console.log(ranking);
});
