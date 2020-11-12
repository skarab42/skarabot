const chalk = require("chalk");
const colors = new chalk.Instance({ level: 3 });

module.exports = ({ message }, next) => {
  const { user, msg } = message;
  const text = message.message;
  const { color } = msg._tags;
  const nick = colors.hex(color)(`[${user}]`);

  if (text.startsWith("!error")) {
    return next();
  }

  // eslint-disable-next-line no-console
  console.log(`${nick} ${text}`);

  next();
};
