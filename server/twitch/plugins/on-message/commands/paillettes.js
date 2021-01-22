const max = 1500;

module.exports = async ({ command, client, message }) => {
  let [number] = command.args;

  number = parseInt(Math.abs(number || 42));

  if (isNaN(number) || number > max) {
    client.chat.say(
      message.channel,
      `Usage: !paillettes <number> (max:${max})`
    );
    return;
  }

  console.log({ number });
  client.io.emit("paillettes", { number });
};
