function getHeight() {
  return (
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  );
}

function stop() {
  const lines = document.getElementsByClassName("line");
  const root = document.querySelector("#root");
  const text = document.querySelector("#text");

  root.style.display = "none";
  text.style.display = "none";
}

const defaultMessage = "0110Intrus!on@#§¬";

function start(message = defaultMessage, timeout = 1500) {
  stop();

  const root = document.querySelector("#root");
  const text = document.querySelector("#text");

  root.style.display = "block";
  text.style.display = "block";

  text.innerHTML = defaultMessage;
  text.dataset.text = defaultMessage;

  setTimeout(() => {
    text.innerHTML = message;
    text.dataset.text = message;
  }, timeout);

  setTimeout(() => {
    text.style.display = "none";
  }, 5000);

  for (let i = 0; i < getHeight() / 10; i++) {
    const line = document.createElement("div");
    line.className = `line line-${i}`;
    line.style.top = `${i * 10}px`;
    const time = Math.random() * 5;
    line.style.animation = `lines ${time}s infinite`;
    document.body.appendChild(line);
  }
}

module.exports = {
  start,
  stop,
};
