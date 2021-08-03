const { default: anime } = require("animejs");
const socket = require("socket.io-client")();
const random = require("./libs/random");

const imgSize = { width: 100, height: 100 };
const $wall = document.getElementById("wall");
const baseURL = "https://static-cdn.jtvnw.net/jtv_user_pictures/";

const startScale = 5;
const blinkTime = 1000;
const animeDuration = 5000;
const showTimeout = 8000;
let showTimeoutId = null;

let viewerCount = 0;
const viewerIds = new Map();

hide();

// TODO print/log error
function onError(error) {
  // eslint-disable-next-line
  console.error("ERROR >>>", error);
}

function hide() {
  $wall.style.display = "none";
}

function show(timeout = 0) {
  $wall.style.display = "block";
  showTimeoutId && clearTimeout(showTimeoutId);
  showTimeoutId = setTimeout(hide, timeout || showTimeout);
}

function addSticker({ id, avatarURL, badges, position }, index) {
  if (viewerIds.has(id)) {
    document.getElementById(`user-${id}`).remove();
  }

  viewerIds.set(id, true);

  const [w, h] = [imgSize.width * startScale, imgSize.height * startScale];
  const [x, y] = [random(-200, 200), random(-200, 200)];
  const $img = new Image(w, h);

  $img.src = `${baseURL}/${avatarURL}`;
  $img.id = `user-${id}`;
  $img.style.position = "absolute";
  $img.style.top = `${window.innerHeight / 2 - h / 2 + y}px`;
  $img.style.left = `${window.innerWidth / 2 - w / 2 + x}px`;
  $img.style.boxShadow = "10px 20px 30px rgba(0,0,0,0.5)";
  $img.style.borderRadius = random(0, 100) + "%";

  if (badges.subscriber) {
    $img.style.border = "15px rgba(237,16,226,0.5) solid";
  } else if (badges.vip) {
    $img.style.border = "15px rgba(237,189,16,0.5) solid";
  } else if (badges.moderator) {
    $img.style.border = "15px rgba(123,16,237,0.5) solid";
  }

  $img.style.zIndex = index;

  $img.onload = () => {
    show();
    anime({
      targets: $img,
      top: position.y,
      left: position.x,
      width: imgSize.width,
      height: imgSize.height,
      scale: index / viewerCount + 0.2,
      delay: random(0, 2000),
      rotate: random(-5, 5),
      duration: animeDuration,
      changeComplete: function () {
        $img.style.filter = `blur(${(1 - index / viewerCount) * 4}px)`;
      },
    });
    $wall.append($img);
  };
  $img.onerror = () => {
    $img.remove();
    onError(`Image not found (user-${id})`);
    socket.emit("wof.image-not-found", id);
  };
}

function addStickers(viewers) {
  viewerCount += viewers.length;
  viewers.reverse().forEach(addSticker);
}

function addViewer(viewer) {
  addSticker(viewer, ++viewerCount);
}

function addViewers(viewers) {
  viewers.forEach(addViewer);
}

function blink({ user, count }) {
  const timeout = count * blinkTime;
  const duration = blinkTime / 2;
  const keyframes = [];

  for (var i = 0; i < count; i++) {
    keyframes.push({ scale: 2, duration }, { scale: 1, duration });
  }

  const targets = `#user-${user.id}`;
  const $img = document.querySelector(targets);

  const filter = $img.style.filter;

  $img.style.zIndex = viewerCount;
  $img.style.filter = "none";

  show(timeout);
  anime({
    targets,
    keyframes,
    complete: () => {
      $img.style.filter = filter;
    },
  });
}

function move(chatMessage) {
  const { id, position } = chatMessage.data.viewer;
  const $img = document.getElementById(`user-${id}`);
  $img.style.top = `${position.y}px`;
  $img.style.left = `${position.x}px`;
  $img.style.zIndex = viewerCount;
}

socket.on("wof.move", move);
socket.on("wof.show", () => show(5000));
socket.on("wof.hide", hide);
socket.on("wof.blink", blink);
socket.on("wof.add-viewer", addViewer);
socket.on("wof.add-viewers", addViewers);

socket.emit("viewers.get-famouses", { limit: 500 }, addStickers);
