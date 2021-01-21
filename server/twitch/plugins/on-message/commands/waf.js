module.exports = async ({ command, client }) => {
  let [action] = command.args;

  action = action === "hide" ? "hide" : "show";

  client.io.emit(`wof.${action}`);
};
