<script>
  import io from "socket.io-client";
  import confetti from "canvas-confetti";

  const socket = io();

  let canvasWrapper = null;

  function fire(number, options) {
    const canvas = document.createElement("canvas");
    const myConfetti = confetti.create(canvas);

    canvas.classList.add("absolute");
    canvas.width = `${window.innerWidth}`;
    canvas.height = `${window.innerHeight}`;

    canvasWrapper.appendChild(canvas);

    myConfetti({
      shapes: ["circle", "square"],
      particleCount: number,
      startVelocity: 85,
      scalar: 1.2,
      decay: 0.9,
      ticks: 400,
      spread: 55,
      angle: 160,
      origin: {
        x: 0.85,
        y: 0.18,
      },
      ...options,
    }).then(() => {
      canvas.remove();
    });
  }

  function onPaillettes({ number }) {
    const count = Math.round(number / 3);

    fire(count, {
      scalar: 1.1,
      decay: 0.9,
      spread: 85,
      angle: 160,
      startVelocity: 85,
      origin: {
        x: 0.88,
        y: 0.15,
      },
    });

    fire(count, {
      scalar: 1.0,
      decay: 0.9,
      spread: 85,
      angle: 165,
      startVelocity: 85,
      origin: {
        x: 0.85,
        y: 0.18,
      },
    });

    fire(count, {
      scalar: 1.2,
      decay: 0.9,
      spread: 85,
      angle: 170,
      startVelocity: 85,
      origin: {
        x: 0.82,
        y: 0.2,
      },
    });
  }

  socket.on("paillettes", onPaillettes);
</script>

<div class="absolute inset-0" bind:this="{canvasWrapper}"></div>
