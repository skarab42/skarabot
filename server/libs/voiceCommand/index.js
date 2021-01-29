const { fork } = require("child_process");
const path = require("path");

const serverPath = path.join(__dirname, "server.js");

function bufferToString(buffer) {
  return (Buffer.isBuffer(buffer) ? buffer.toString() : buffer).trim();
}

function log(message) {
  // eslint-disable-next-line no-console
  console.log(bufferToString(message));
}

function start(onMessage) {
  const child = fork(serverPath, [], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });

  child.stderr.on("data", log);
  child.stdout.on("data", log);

  child.on("message", onMessage);

  child.on("close", (code) => {
    log(`exited with code ${code || 0}`);
  });
}

module.exports = start;
