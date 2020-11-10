
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { l as lib } from './index-a2398fdd.js';

const socket = lib();

const $video = document.querySelector("#video");

const widoWidth = 450;
const videoDuration = 15000;
const videoSize = {
  width: widoWidth,
  height: widoWidth / 1.777777
};

$video.style.position = "absolute";
$video.style.top = `50px`;
$video.style.right = "0px";

function showVideo(show = true) {
  $video.style.display = show ? "block" : "none";
  if (!show) $video.innerHTML = "";
}

showVideo(false);

const queue = [];
let lock = false;

function done() {
  lock = false;
  processQueue();
}

function push(id) {
  queue.push(id);
  processQueue();
}

function processQueue() {
  if (!queue.length || lock) return;
  lock = true;

  const id = queue.shift();

  const player = new Twitch.Player("video", { video: id, ...videoSize });

  player.setVolume(0.5);

  player.addEventListener(Twitch.Player.READY, () => {
    showVideo(true);
    player.play();
    setTimeout(() => {
      player.pause();
      showVideo(false);
      done();
    }, videoDuration);
  });
}

socket.on("streamer-highlight", ({ id }) => push(id));

var streamerHighlight = {

};

export default streamerHighlight;
//# sourceMappingURL=streamer-highlight.js.map
