const socket = require("socket.io-client")();
const shuffle = require("./libs/shuffle");
const counter = require("./libs/counter");
const player = require("./libs/player");

let queue = [];
let lock = false;

function showOverlay(show = true) {
  document.body.classList[show ? "add" : "remove"]("overlay");
}

function clearQueue() {
  queue = [];
}

function next() {
  lock = false;
  processQueue();
}

function processQueue() {
  showOverlay(queue.length);

  if (!queue.length || lock) return;
  lock = true;

  player.playAndDestroy(queue.shift(), next);
}

function videoPush(video) {
  queue.push(video);
  processQueue();
}

function pauseStart({ minutes, videos }) {
  videos.forEach(videoPush);
  showOverlay(true);
  counter.start(minutes, () => {
    !queue.length && shuffle(videos).forEach(videoPush);
  });
}

function pauseStop() {
  showOverlay(false);
  counter.stop();
  clearQueue();
}

socket.on("video.push", videoPush);
socket.on("pause.start", pauseStart);
socket.on("pause.stop", pauseStop);
