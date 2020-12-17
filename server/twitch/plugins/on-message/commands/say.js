const removeDiacritics = require("../../../../libs/removeDiacritics");
const say = require("say");

const cooldownTimeout = 30;

const queue = [];
let saying = false;

const speed = 1.3;
const voice = 0;
const voices = [
  "Microsoft Hortense Desktop",
  "Microsoft Zira Desktop",
  "Microsoft David Desktop",
  "Microsoft Haruka Desktop",
  "Microsoft Irina Desktop",
];

// say.getInstalledVoices((...args) => {
//   console.log(args);
// });

function sayText(text) {
  text = text.replace(/[_-]/g, " ");
  text = removeDiacritics(text);

  say.speak(text, voices[voice], speed, () => {
    saying = false;
    if (queue.length) {
      sayText(queue.shift());
    }
  });
}

module.exports = ({ command, message, client, cooldown }) => {
  if (cooldown("cmd.say", cooldownTimeout)) return;

  let text = command.args.join(" ");

  if (!text) {
    client.chat.say(message.channel, `Usage: !say <text>`);
    return;
  }

  if (saying) {
    return queue.push(text);
  }

  saying = true;

  sayText(text);
};
