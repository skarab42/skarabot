const { fork } = require("child_process");
const path = require("path");

const serverPath = path.join(__dirname, "server.js");

function bufferToString(buffer) {
  return (Buffer.isBuffer(buffer) ? buffer.toString() : buffer).trim();
}

function log(message) {
  // eslint-disable-next-line no-console
  console.log("[voiceCommand]", bufferToString(message));
}

function start(onMessage) {
  log("start");

  const child = fork(serverPath, [], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });

  child.stderr.on("data", log);
  child.stdout.on("data", log);

  child.on("message", onMessage);

  function killChild() {
    child && child.kill();
  }

  child.on("error", (error) => {
    log(`error: ${error.message}`);
    killChild();
  });

  child.on("close", (code) => {
    log(`stop with code ${code || 0}`);
    killChild();
    start(onMessage);
  });

  process.on("close", (code) => {
    killChild();
    log(`exit with code ${code || 0}`);
  });
}

start(({ Confidence, Text: text }) => {
  const confidence = parseFloat(Confidence);
  if (confidence < 0.9) return;
  if (text === "paillette") {
    console.log("paillettes");
  }
});

module.exports = start;
