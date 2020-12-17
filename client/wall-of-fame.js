const { default: anime } = require("animejs");
const socket = require("socket.io-client")();
const random = require("./libs/random");

const imgSize = { width: 100, height: 100 };
const $wall = document.querySelector("#wall");

const startScale = 5;
const blinkTime = 1000;
const animeDuration = 5000;
const showTimeout = 8000;
let showTimeoutId = null;

let usersCount = 0;

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

function addSticker({ id, avatarURL, position }, index) {
  const [w, h] = [imgSize.width * startScale, imgSize.height * startScale];
  const [x, y] = [random(-200, 200), random(-200, 200)];
  const $img = new Image(w, h);
  $img.src = avatarURL;
  $img.id = `user-${id}`;
  $img.style.position = "absolute";
  $img.style.top = `${window.innerHeight / 2 - h / 2 + y}px`;
  $img.style.left = `${window.innerWidth / 2 - w / 2 + x}px`;
  $img.style.boxShadow = "10px 20px 30px rgba(0,0,0,0.5)";
  $img.style.borderRadius = random(0, 100) + "%";
  $img.style.zIndex = index;
  $img.onload = () => {
    show();
    anime({
      targets: $img,
      top: position.y,
      left: position.x,
      width: imgSize.width,
      height: imgSize.height,
      scale: (index / usersCount) + 0.2,
      delay: random(0, 2000),
      rotate: random(-5, 5),
      duration: animeDuration,
      changeComplete: function () {
        $img.style.filter = `blur(${(1 - (index / usersCount)) * 4}px)`;
      }
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
  const usersArr = Object.values(users)
    .map(({ id, avatarURL, position, lastSeen }) => {
      return avatarURL ? { id, avatarURL, position, lastSeen } : null;
    })
    .filter((item) => item)
    .sort((a, b) => a.lastSeen - b.lastSeen);
  usersCount = usersArr.length;
  usersArr.forEach(addSticker);
}

socket.on("wof.move", (chatMessage) => {
  const { id, position } = chatMessage.data.user;
  const $img = document.querySelector(`#user-${id}`);
  $img.style.top = `${position.y}px`;
  $img.style.left = `${position.x}px`;
  $img.style.zIndex = usersCount;
});

socket.on("wof.add-user", (user) => addSticker(user, usersCount));

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
  $img.style.zIndex = usersCount;

  show(timeout);
  anime({
    targets,
    keyframes,
    complete: () => {
      $img.style.zIndex = zIndex;
    },
  });
});

fetch("/users")
  .then((response) => response.json())
  .then(addStickers)
  .catch(onError);

// TODO dégage moi ça de là!!!!!
socket.on("play.sound", ({ file }) => {
  const audio = new Audio(`download/${file}`);
  audio.volume = 0.5;
  audio.play();
});
