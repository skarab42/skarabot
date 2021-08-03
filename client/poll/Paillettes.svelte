<script>
  import io from "socket.io-client";
  import random from "../libs/random";
  import confetti from "canvas-confetti";

  const socket = io();

  let canvasWrapper = null;

  function fire(number, options = {}) {
    const canvas = document.createElement("canvas");
    const myConfetti = confetti.create(canvas);

    canvas.classList.add("absolute");
    canvas.width = `${window.innerWidth}`;
    canvas.height = `${window.innerHeight}`;

    canvasWrapper.appendChild(canvas);

    myConfetti({
      particleCount: number,
      startVelocity: 85,
      scalar: 1.2,
      decay: 0.9,
      ticks: 100,
      spread: 55,
      angle: 160,
      origin: {
        x: 0.85,
        y: 0.25,
      },
      ...options,
    }).then(() => {
      canvas.remove();
    });
  }

  let counter = 0;

  function fires() {
    if (counter > 10) {
      counter = 0;
      return;
    }

    counter++;

    fire(random(50, 100), {
      spread: random(10, 70),
      angle: random(140, 180),
      ticks: random(50, 100),
      gravity: random(95, 100) / 100,
      // decay: random(85, 90) / 100,
      scalar: random(80, 120) / 100,
      startVelocity: random(50, 100),
    });

    setTimeout(fires, 42);
  }

  socket.on("paillettes", fires);

</script>

<div class="absolute inset-0" bind:this="{canvasWrapper}"></div>
