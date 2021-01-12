const poll = require("../../../../store/poll");
const { twitchClient } = require("../../../index");

poll.set(`started`, false);

const actions = {
  start() {
    if (poll.get(`started`)) return;
    poll.set(`logs`, {});
    poll.set(`started`, true);
    twitchClient.io.emit("poll.start");
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

  let [action] = command.args;
  const actionNames = Object.keys(actions);

  if (!action || !actionNames.includes(action)) {
    return client.chat.say(
      message.channel,
      `Usage: !poll <${actionNames.join("|")}>`
    );
  }

  actions[action]();
};
