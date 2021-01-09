const poll = require("../../../../store/poll");

const defaultDuration = 42;

module.exports = async ({ command, message, client }) => {
  const viewer = message.data.viewer;
  let [action, duration, ...includes] = command.args;

  if (!(viewer.badges.broadcaster || viewer.badges.moderator)) {
    client.chat.say(
      message.channel,
      `Usage: pas pour toi ${viewer.name} Kappa`
    );
    return;
  }

  const stop = () => {
    client.emit("poll.stop");
    poll.set(`started`, false);
    client.chat.say(message.channel, `Les votes sont terminés.`);
  };

  const funcs = {
    stop,
    start: () => {
      duration = parseInt(duration || defaultDuration);

      poll.set(`started`, true);
      client.emit("poll.start", { duration });
      setTimeout(stop, duration * 1000);

      client.chat.say(
        message.channel,
        `Les votes sont ouverts durant ${duration} sec.`
      );
    },
    hide: () => {
      client.emit("poll.hide");
    },
    reset: () => {
      poll.set(`items`, {});
      poll.set(`started`, false);
      poll.set(`includes`, null);
      client.emit("poll.reset");
      client.chat.say(message.channel, `Les votes sont remis a zéro.`);
    },
    includes: () => {
      if (!duration) {
        poll.set(`includes`, null);
        return;
      }
      poll.set(
        `includes`,
        [duration, ...includes].map((item) => item.toUpperCase())
      );
    },
  };

  const funcKeys = Object.keys(funcs);

  if (!action || !funcKeys.includes(action)) {
    client.chat.say(
      message.channel,
      `Usage: !poll <${funcKeys.join("|")}> [duration]`
    );
    return;
  }

  funcs[action]();
};
