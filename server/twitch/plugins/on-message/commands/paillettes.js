const cooldownTimeout = 30;

module.exports = async ({ client, cooldown }) => {
  if (cooldown("cmd.paillettes", cooldownTimeout)) return;

  client.io.emit("paillettes");
};
