const { playSound } = require("./libs/sound");
const socket = require("socket.io-client")();
const glitch = require("./libs/glitch");

const $player = document.querySelector("#player");

function twitchClipPlayer(clip) {
  const url = "https://clips.twitch.tv/embed";
  const $iframe = document.createElement("iframe");
  $iframe.setAttribute(
    "src",
    `${url}?clip=${clip.id}?mute=false&autoplay=true&parent=localhost`
  );
  $iframe.setAttribute("allowfullscreen", `false`);
  $iframe.setAttribute("frameborder", `0`);
  $iframe.setAttribute("scrolling", `no`);
  $iframe.setAttribute("width", `100%`);
  $iframe.setAttribute("height", `100%`);

  $player.innerHTML = "";
  $player.append($iframe);
  $player.style.display = "block";

  setTimeout(() => {
    glitch.stop();
  }, 5000);

  setTimeout(() => {
    glitch.start(clip.channel);
  }, 12000);

  setTimeout(() => {
    $iframe && $iframe.remove();
    document.body.style.display = "none";
    $player.style.display = "block";
    $player.innerHTML = "";
    glitch.stop();
  }, clip.duration * 1000);
}

function faudreyVoir({ name, clip }) {
  glitch.start(`0101 ${name} 01000101`);
  document.body.style.display = "block";
  twitchClipPlayer(clip);
}

socket.on("faudrey_voir", faudreyVoir);
socket.on("play.sound", playSound);
