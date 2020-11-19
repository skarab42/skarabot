const ms = require("ms");

const $counter = document.querySelector("#counter");
const $countdown = document.querySelector("#countdown");

let countdown = 0;
let countdownId = null;

exports.start = function (minutes, tick = null) {
  clearInterval(countdownId);
  countdown = minutes * 60 * 1000;
  $countdown.innerHTML = ms(countdown);
  $counter.style.display = "block";
  countdownId = setInterval(() => {
    $countdown.innerHTML = ms(countdown);
    countdown -= 1000;
    if (countdown <= 0) {
      countdown += 42000;
    }
    tick && tick();
  }, 1000);
};

exports.stop = function () {
  clearInterval(countdownId);
  $counter.style.display = "none";
};
