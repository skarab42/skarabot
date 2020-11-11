
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { l as lib } from './index-de619607.js';
import { r as require$$1 } from './anime.es-473b9834.js';

const socket = lib();
const { default: anime } = require$$1;

const imgSize = { width: 100, height: 100 };
const $wall = document.querySelector("#wall");

const startScale = 5;
const blinkTime = 1000;
const animeDuration = 3000;
const showTimeout = 5000;
let showTimeoutId = null;

hide();

// TODO print/log error
function onError(error) {
  // eslint-disable-next-line
  console.error("ERROR >>>", error);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function hide() {
  $wall.style.display = "none";
}

function show(timeout = 0) {
  $wall.style.display = "block";
  showTimeoutId && clearTimeout(showTimeoutId);
  showTimeoutId = setTimeout(hide, timeout || showTimeout);
}

function addSticker({ id, avatarURL, position }) {
  const [w, h] = [imgSize.width * startScale, imgSize.height * startScale];
  const [x, y] = [random(-200, 200), random(-200, 200)];
  const $img = new Image(w, h);
  $img.src = avatarURL;
  $img.id = `user-${id}`;
  $img.style.position = "absolute";
  $img.style.top = `${window.innerHeight / 2 - h / 2 + y}px`;
  $img.style.left = `${window.innerWidth / 2 - w / 2 + x}px`;
  $img.style.borderRadius = random(0, 100) + "%";
  $img.onload = () => {
    show();
    anime({
      targets: $img,
      top: position.y,
      left: position.x,
      width: imgSize.width,
      height: imgSize.height,
      delay: random(0, 2000),
      duration: animeDuration
    });
    $wall.append($img);
  };
  $img.onerror = () => {
    $img.remove();
    onError(`Image not found (user-${id})`);
    socket.emit("wof.image-not-found", id);
  };
}

function addStickers(users) {
  Object.values(users)
    .map(({ id, avatarURL, position }) => {
      return avatarURL ? { id, avatarURL, position } : null;
    })
    .filter(item => item)
    .forEach(addSticker);
}

socket.on("wof.move", chatMessage => {
  const { id, position } = chatMessage.data.user;
  const $img = document.querySelector(`#user-${id}`);
  $img.style.top = `${position.y}px`;
  $img.style.left = `${position.x}px`;
});

socket.on("wof.add-user", addSticker);

socket.on("wof.blink", ({ user, count }) => {
  const timeout = count * blinkTime;
  const duration = blinkTime / 2;
  const keyframes = [];

  for (var i = 0; i < count; i++) {
    keyframes.push({ scale: 2, duration }, { scale: 1, duration });
  }

  const targets = `#user-${user.id}`;
  const $img = document.querySelector(targets);

  const zIndex = $img.style.zIndex;
  $img.style.zIndex = 9999;

  show(timeout);
  anime({
    targets,
    keyframes,
    complete: () => {
      $img.style.zIndex = zIndex;
    }
  });
});

fetch("/users")
  .then(response => response.json())
  .then(addStickers)
  .catch(onError);

var wallOfFame = {

};

export default wallOfFame;
//# sourceMappingURL=wall-of-fame.js.map
