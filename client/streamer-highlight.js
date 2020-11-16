const { default: anime } = require("animejs");
const socket = require("socket.io-client")();
const random = require("./utils/random");
const ms = require("ms");

const $video = document.querySelector("#video");
const $player = document.querySelector("#player");
const $title = document.querySelector("#title");
const $counter = document.querySelector("#counter");
const $countdown = document.querySelector("#countdown");

const videoWidth = 600;
const videoDuration = 15000;
const videoSize = {
  width: videoWidth,
  height: videoWidth / 1.777777,
};

$video.style.position = "absolute";

function showVideo(show = true, { user } = {}) {
  $video.style.display = show ? "block" : "none";
  $video.style.top = `-${videoSize.height}px`;
  $video.style.left = `${window.innerWidth / 2 - videoSize.width / 2}px`;
  $title.innerHTML = user ? `${user.name} présente ...` : "";
  document.body.classList[show ? "add" : "remove"]("overlay");
  anime({
    targets: $video,
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
  if (!show) $player.innerHTML = "";
}

showVideo(false);

const queue = [];
let lock = false;

function done() {
  lock = false;
  processQueue();
}

function push(video) {
  queue.push(video);
  processQueue();
}

function processQueue() {
  if (!queue.length || lock) return;
  lock = true;

  const { id, user, channel, duration } = queue.shift();

  const player = new Twitch.Player("player", { video: id, ...videoSize });

  player.setVolume(0.5);

  player.addEventListener(Twitch.Player.READY, () => {
    socket.emit("video-play", { user, channel });
    showVideo(true, { user });
    const min = parseInt(duration * 0.25);
    const max = parseInt(duration * 0.75);
    player.seek(random(min, max));
    player.play();
    setTimeout(() => {
      player.pause();
      showVideo(false);
      done();
    }, videoDuration);
  });
}

socket.on("streamer-highlight", push);

let countdown = 0;
let countdownId = null;

socket.on("pause", ({ minutes }) => {
  clearInterval(countdownId);
  countdown = minutes * 60 * 1000;
  $countdown.innerHTML = ms(countdown);
  $counter.style.display = "block";
  countdownId = setInterval(() => {
    $countdown.innerHTML = ms(countdown);
    countdown -= 1000;
    if (countdown <= 0) {
      clearInterval(countdownId);
      $counter.style.display = "none";
    }
  }, 1000);
});
