const { default: animejs } = require("animejs");
const socket = require("socket.io-client")();
const random = require("./random");

const playDuration = 30; // seconds
const videoWidth = 600;
const videoSize = {
  width: videoWidth,
  height: videoWidth / 1.777777,
};

const $counter = document.querySelector("#counter");
const $video = document.querySelector("#video");
const $title = document.querySelector("#title");

let player;

function anime(targets) {
  let top = window.innerHeight / 2 - videoSize.height / 2 - 40;

  if ($counter.style.display !== "none") {
    top += 42;
  }

  animejs({
    targets,
    keyframes: [
      { top, duration: 2000 },
      { scale: 2, duration: 1000 },
    ],
  });
}

function showVideo(show = true) {
  $video.style.display = show ? "block" : "none";
  $video.style.top = `-${videoSize.height}px`;
  $video.style.left = `${window.innerWidth / 2 - videoSize.width / 2}px`;
  show && anime($video);
}

function setTitle(user) {
  $title.innerHTML = user ? `${user.name} présente ...` : "";
}

function removePlayer() {
  if (!player) return;
  showVideo(false);
  player._iframe.remove();
  player = null;
}

function playAndDestroy(video, next) {
  const min = parseInt(video.duration * 0.25);
  const max = parseInt(video.duration * 0.75);
  const timestamp = parseInt(random(min, max));

  player = new Twitch.Player("player", {
    autoplay: false,
    video: video.id,
    ...videoSize,
    mute: true,
  });

  player.addEventListener(Twitch.Player.PLAYING, () => {
    setTitle(video.user);
    showVideo(true);
    setTimeout(() => {
      socket.emit("video-play", video);
    }, playDuration / 2);
    setTimeout(() => {
      removePlayer();
      next();
    }, playDuration * 1000);
  });

  player.addEventListener(Twitch.Player.READY, () => {
    player.seek(timestamp);
    player.setVolume(0);
    player.play();
  });
}

module.exports = {
  play: playAndDestroy,
  remove: removePlayer,
};
