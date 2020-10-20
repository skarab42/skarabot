
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { l as lib } from './index-41ff57ee.js';

const socket = lib();

socket.on("wall-of-fame.move", chatMessage => {
  const { id, position } = chatMessage.data.user;
  const $img = document.querySelector(`#user-${id}`);
  $img.style.top = `${position.y}px`;
  $img.style.left = `${position.x}px`;
  console.log("move:", { id, position });
});

const imgSize = { width: 100, height: 100 };

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
  $wall.append($img);
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
  .catch(error => {
    console.error(error);
  });

var wallOfFame = {

};

export default wallOfFame;
//# sourceMappingURL=wall-of-fame.js.map
