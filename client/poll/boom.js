import confetti from "canvas-confetti";

export default function boom(currentName) {
  const canvas = document.getElementById(`canvas-${currentName}`);
  const myConfetti = confetti.create(canvas);

  myConfetti({
    particleCount: 500,
    startVelocity: 15,
    spread: 75,
    angle: 60,
    origin: {
      x: 0,
      y: 1,
    },
  });
  myConfetti({
    particleCount: 500,
    startVelocity: 15,
    spread: 50,
    angle: 90,
    origin: {
      x: 0.5,
      y: 1,
    },
  });
  myConfetti({
    particleCount: 500,
    startVelocity: 15,
    spread: 75,
    angle: 120,
    origin: {
      x: 1,
      y: 1,
    },
  });
}
