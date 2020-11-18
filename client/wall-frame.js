const youtubePlayer = require("youtube-player");
const socket = require("socket.io-client")();

require("./libs/PerspectiveTransform");

const size = { width: 700, height: 500 };
const edit = window.location.search.includes("edit");
const $players = document.querySelector("#players");
const $handles = document.querySelector("#handles");
const transform = new PerspectiveTransform(
  $players,
  size.width,
  size.height,
  true
);

const handleSize = 42;
const handles = {};

$players.style.opacity = edit ? 0.5 : 1;
$handles.style.display = edit ? "block" : "none";

$players.style.width = `${size.width}px`;
$players.style.height = `${size.height}px`;

function makeHandle(position) {
  const $handle = document.createElement("div");
  $handle.classList.add("handle");
  $handle.style.position = "absolute";
  $handle.style.width = `${handleSize}px`;
  $handle.style.height = `${handleSize}px`;
  $handle.style.top = `${transform[position].y - handleSize / 2}px`;
  $handle.style.left = `${transform[position].x - handleSize / 2}px`;

  const onMouseMove = (event) => {
    $handle.style.top = `${event.pageY - handleSize / 2}px`;
    $handle.style.left = `${event.pageX - handleSize / 2}px`;
    transform[position].y = event.pageY;
    transform[position].x = event.pageX;
    transform.update();

    socket.emit("frame.handles.coords", {
      topLeft: transform.topLeft,
      topRight: transform.topRight,
      bottomLeft: transform.bottomLeft,
      bottomRight: transform.bottomRight,
    });
  };

  $handle.addEventListener("mousedown", () => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", onMouseMove);
    });
  });

  handles[position] = $handle;
  return $handle;
}

const topLeft = makeHandle("topLeft");
const topRight = makeHandle("topRight");
const bottomLeft = makeHandle("bottomLeft");
const bottomRight = makeHandle("bottomRight");

$handles.append(topLeft, topRight, bottomLeft, bottomRight);

const player = youtubePlayer("youtube-player", { ...size });

player.mute();

socket.on("frame.push", (target) => {
  player.loadVideoById(target.id);
  player.playVideo().then(() => {
    console.log("playing...", target.id);
  });
});

socket.emit("frame.handles.getCoords");
socket.on("frame.handles.coords", (coords) => {
  Object.entries(coords).forEach(([key, val]) => {
    transform[key] = val;
    handles[key].style.top = `${val.y - handleSize / 2}px`;
    handles[key].style.left = `${val.x - handleSize / 2}px`;
  });
  transform.update();
});
