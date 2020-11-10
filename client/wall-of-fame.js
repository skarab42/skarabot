const socket = require("socket.io-client")();

const imgSize = { width: 100, height: 100 };
const $wall = document.querySelector("#wall");

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

function show() {
  $wall.style.display = "block";
  showTimeoutId && clearTimeout(showTimeoutId);
  showTimeoutId = setTimeout(hide, showTimeout);
}

function addSticker({ id, avatarURL, position }) {
  const $img = new Image(imgSize.width, imgSize.height);
  $img.src = avatarURL;
  $img.id = `user-${id}`;
  $img.style.position = "absolute";
  $img.style.top = `${position.y}px`;
  $img.style.left = `${position.x}px`;
  $img.style.borderRadius = random(0, 100) + "%";
  $img.onload = () => {
    show();
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

fetch("/users")
  .then(response => response.json())
  .then(addStickers)
  .catch(onError);
