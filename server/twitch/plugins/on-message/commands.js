const commands = require("./commands/index");

module.exports = ({ message, client }, next) => {
  const text = message.message;

  if (text[0] !== "!" || text[1] === "!") {
    return next();
  }

  const args = text.slice(1).split(" ");
  const name = args.shift();
  const command = { name, args };
  const commandFn = commands[name];

  if (typeof commandFn === "function") {
    commandFn({ command, message, client });
  } else {
    command.name = "alias";
    command.args.unshift(name);
    commands.alias({ command, message, client });
  }

  next();
};
