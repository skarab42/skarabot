const { default: animejs } = require("animejs");
const random = require("./utils/random");

const playDuration = 15; // seconds
const videoWidth = 600;
const videoSize = {
  width: videoWidth,
  height: videoWidth / 1.777777,
};

const $video = document.querySelector("#video");
const $title = document.querySelector("#title");

function anime(targets) {
  animejs({
    targets,
    keyframes: [
      {
        top: window.innerHeight / 2 - videoSize.height / 2 - 40,
        duration: 2000,
      },
      {
        scale: 2,
        duration: 1000,
      },
    ],
  });
}

function showVideo(show = true) {
  $video.style.display = show ? "block" : "none";
  $video.style.top = `-${videoSize.height}px`;
  $video.style.left = `${window.innerWidth / 2 - videoSize.width / 2}px`;
  anime($video);
}

function setTitle(user) {
  $title.innerHTML = user ? `${user.name} présente ...` : "";
}

function playAndDestroy(video, next) {
  const min = parseInt(video.duration * 0.25);
  const max = parseInt(video.duration * 0.75);
  const timestamp = parseInt(random(min, max));

  let player = new Twitch.Player("player", {
    autoplay: false,
    video: video.id,
    ...videoSize,
  });

  player.addEventListener(Twitch.Player.PLAYING, () => {
    setTitle(video.user);
    showVideo(true);
    setTimeout(() => {
      showVideo(false);
      removePlayer();
      next();
    }, playDuration * 1000);
  });

  player.addEventListener(Twitch.Player.READY, () => {
    player.seek(timestamp);
    player.setVolume(0.5);
    player.play();
  });

  const removePlayer = () => {
    player._iframe.remove();
    player = null;
  };
}

module.exports = {
  playAndDestroy,
};
