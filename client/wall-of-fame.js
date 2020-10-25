const socket = require("socket.io-client")();

socket.on("wall-of-fame.move", chatMessage => {
  const { id, position } = chatMessage.data.user;
  const $img = document.querySelector(`#user-${id}`);
  $img.style.top = `${position.y}px`;
  $img.style.left = `${position.x}px`;
});

const imgSize = { width: 100, height: 100 };

// TODO print/log error
function onError(error) {
  // eslint-disable-next-line
  console.error("ERROR >>>", error);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const $wall = document.querySelector("#wall");

function addSticker({ id, avatarURL, position }) {
  const $img = new Image(imgSize.width, imgSize.height);
  $img.src = avatarURL;
  $img.id = `user-${id}`;
  $img.style.position = "absolute";
  $img.style.top = `${position.y}px`;
  $img.style.left = `${position.x}px`;
  $img.style.borderRadius = random(0, 100) + "%";
  $img.onload = () => $wall.append($img);
  $img.onerror = () => onError(`Image not found (user-${id})`);
}

function addStickers(users) {
  Object.values(users)
    .map(({ id, avatarURL, position }) => {
      return avatarURL ? { id, avatarURL, position } : null;
    })
    .filter(item => item)
    .forEach(addSticker);
}

fetch("/users")
  .then(response => response.json())
  .then(addStickers)
  .catch(onError);
