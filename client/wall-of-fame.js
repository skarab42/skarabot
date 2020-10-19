// const socket = require("socket.io-client")();

// socket.on("twitch.chat.onMessage", chatMessage => {
//   console.log("onMessage:", chatMessage);
// });

const imgSize = { width: 100, height: 100 };

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const $wall = document.querySelector("#wall");

function addSticker({ avatarURL, position }) {
  const $img = new Image(imgSize.width, imgSize.height);
  $img.src = avatarURL;
  $img.style.position = "absolute";
  $img.style.top = `${position.y}px`;
  $img.style.left = `${position.x}px`;
  $img.style.borderRadius = random(0, 100) + "%";
  $wall.append($img);
}

function addStickers(users) {
  Object.values(users)
    .map(({ avatarURL, position }) => {
      return avatarURL ? { avatarURL, position } : null;
    })
    .filter(item => item)
    .forEach(addSticker);
}

fetch("/users")
  .then(response => response.json())
  .then(addStickers)
  .catch(error => {
    console.error(error);
  });
