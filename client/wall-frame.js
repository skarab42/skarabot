const youtubePlayer = require("youtube-player");
const socket = require("socket.io-client")();

const player = youtubePlayer("player");

player.mute();

socket.on("frame.push", (target) => {
  player.loadVideoById(target.id);
  player.playVideo().then(() => {
    console.log("playing...", target.id);
  });
});
