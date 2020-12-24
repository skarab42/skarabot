const youtubePlayer = require("youtube-player");
const socket = require("socket.io-client")();

require("./libs/PerspectiveTransform");

const size = { width: 700, height: 500 };
const edit = window.location.search.includes("edit");
const $players = document.querySelector("#players");
const $handles = document.querySelector("#handles");
const $twitchPlayer = document.querySelector("#twitch-player");
const transform = new PerspectiveTransform(
  $players,
  size.width,
  size.height,
  true
);

const handleSize = 42;
const handles = {};
let twitchIframe = null;

const removeTwitchPlayer = () => {
  if (twitchIframe) {
    twitchIframe._iframe.remove();
    twitchIframe = null;
  }
  $twitchPlayer.innerHTML = "";
};

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

function twitchPlayer(props) {
  twitchIframe = new Twitch.Player("twitch-player", {
    autoplay: true,
    ...props,
  });

  twitchIframe.addEventListener(Twitch.Player.ENDED, () => {
    twitchIframe.play();
  });
}

function twitchClipPlayer({ id }) {
  const url = "https://clips.twitch.tv/embed";
  const $iframe = document.createElement("iframe");
  $iframe.setAttribute(
    "src",
    `${url}?clip=${id}?mute=true&autoplay=true&parent=localhost`
  );
  $iframe.setAttribute("allowfullscreen", `false`);
  $iframe.setAttribute("frameborder", `0`);
  $iframe.setAttribute("scrolling", `no`);
  $iframe.setAttribute("width", `100%`);
  $iframe.setAttribute("height", `100%`);
  removeTwitchPlayer();
  $twitchPlayer.append($iframe);
}

socket.on("frame.push", (target) => {
  removeTwitchPlayer();

  if (target.provider === "youtube") {
    player.loadVideoById(target.id);
    player.playVideo().then(() => {
      // console.log("playing...", target.id);
    });
  } else if (target.provider === "twitch") {
    let props = { channel: null, video: null };

    if (target.mediaType === "stream" && target.channel !== "collections") {
      props.channel = target.channel;
    } else if (target.mediaType === "video") {
      props.video = target.id;
    }

    if (target.mediaType === "clip") {
      twitchClipPlayer(target);
    } else {
      twitchPlayer({ ...size, ...props, muted: true });
    }
  }
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
