const poll = require("../../../../store/poll");
const { twitchClient } = require("../../../index");

poll.set(`started`, false);

const actions = {
  start(duration = 42) {
    if (poll.get(`started`)) return;
    duration = parseInt(duration);
    poll.set(`logs`, {});
    poll.set(`started`, true);
    setTimeout(this.stop, duration * 1000);
    twitchClient.io.emit("poll.start", { duration });
  },
  stop() {
    if (!poll.get(`started`)) return;
    poll.set(`started`, false);
    twitchClient.io.emit("poll.stop");
  },
  reset() {
    poll.set(`watching`, false);
    poll.set(`started`, false);
    poll.set(`items`, {});
    poll.set(`logs`, {});
    twitchClient.io.emit("poll.reset");
  },
  show() {
    twitchClient.io.emit("poll.show");
  },
  hide() {
    twitchClient.io.emit("poll.hide");
  },
};

module.exports = async ({ command, message, client, isModo }) => {
  if (!isModo()) return;

  let [action, ...args] = command.args;
  const actionNames = Object.keys(actions);

  if (!action || !actionNames.includes(action)) {
    return client.chat.say(
      message.channel,
      `Usage: !poll <${actionNames.join("|")}>`
    );
  }

  actions[action](...args);
};
