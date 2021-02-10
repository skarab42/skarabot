<script>
  import io from "socket.io-client";
  import { onMount } from "svelte";

  const socket = io();

  let canvas = null;
  let context = null;
  let pixelPerUnit = 40;
  let isGameOver = false;
  let lastNeckPos = null;
  let lastTailPos = null;
  let redColor = "#e80d40";
  // let backgroundColor = "#21282d";

  let width = 800;
  let height = 600;

  const screen = {
    width,
    height,
    cols: width / pixelPerUnit,
    rows: height / pixelPerUnit,
  };

  // const sizes = [120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 4, 3, 2, 1];
  // function pgcd(a, b) {
  //   return (a %= b) == 0 ? b : pgcd(b, a);
  // }
  // console.log(1920 / pgcd(screen.width, screen.height));
  // for (let index = 2; index < 3; index++) {
  //   snake.push({ x: pixelPerUnit * index, y: pixelPerUnit });
  // }

  let snake = [];
  let food = { x: 0, y: 0 };

  function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function spawnSnake() {
    snake = [
      {
        x: Math.ceil(screen.cols / 2) * pixelPerUnit,
        y: Math.ceil(screen.rows / 2) * pixelPerUnit,
      },
    ];
  }

  function spawnFood() {
    food = {
      x: random(0, screen.cols - 1) * pixelPerUnit,
      y: random(0, screen.rows - 1) * pixelPerUnit,
    };

    if (snake.find((p2) => isSameCoords(food, p2))) {
      console.log("PROUT");
      spawnFood();
    }
  }

  onMount(init);

  function reset() {
    food = { x: 0, y: 0 };
    spawnSnake();
    spawnFood();
    draw();
    isGameOver = false;
  }

  function init() {
    context = canvas.getContext("2d");
    setSize();
    reset();
  }

  function setSize() {
    canvas.setAttribute("width", screen.width);
    canvas.setAttribute("height", screen.height);
  }

  function clearScreen() {
    context.clearRect(0, 0, screen.width, screen.height);
  }

  function gameOverScreen() {
    isGameOver = true;
    context.lineWidth = 4;
    context.strokeStyle = redColor;
    context.strokeRect(0, 0, screen.width, screen.height);
    context.font = "142px Roboto";
    context.textAlign = "center";
    context.fillStyle = redColor;
    context.fillText("Game Over!", screen.width / 2, screen.height / 2);
  }

  function draw() {
    clearScreen();
    drawSnake();
    drawFood();
  }

  function drawSnake() {
    const div = Math.round(150 / snake.length);
    snake.forEach(({ x, y }, i) => {
      context.lineWidth = 1;
      context.strokeStyle = `rgba(0,0,0,0.2)`;
      context.fillStyle = `rgb(20,${250 - div * (i + 1)},20)`;
      context.fillRect(x, y, pixelPerUnit, pixelPerUnit);
      context.strokeRect(x, y, pixelPerUnit, pixelPerUnit);
    });
  }

  function drawFood() {
    context.lineWidth = 1;
    context.fillStyle = redColor;
    context.strokeStyle = `rgba(0,0,0,0.2)`;
    context.fillRect(food.x, food.y, pixelPerUnit, pixelPerUnit);
    context.strokeRect(food.x, food.y, pixelPerUnit, pixelPerUnit);
  }

  function isOutOfBound() {
    const { x, y } = snake[0];

    return (
      x < 0 ||
      y < 0 ||
      x > screen.width - pixelPerUnit ||
      y > screen.height - pixelPerUnit
    );
  }

  function isSameCoords(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
  }

  function isCannibal() {
    const p1 = snake[0];
    const goback = lastNeckPos && isSameCoords(p1, lastNeckPos);
    return goback || snake.find((p2, i) => i !== 0 && isSameCoords(p1, p2));
  }

  function hasCollision() {
    return isOutOfBound() || isCannibal();
  }

  function snakeEat() {
    const p1 = snake[0];
    if (isSameCoords(p1, food)) {
      console.log("EAT");
      snake.push(lastTailPos);
      spawnFood();
      draw();
    }
  }

  function top() {
    const { x, y } = snake[0];
    snake.unshift({ x, y: y - pixelPerUnit });
    snake.pop();
  }

  function bottom() {
    const { x, y } = snake[0];
    snake.unshift({ x, y: y + pixelPerUnit });
    snake.pop();
  }

  function left() {
    const { x, y } = snake[0];
    snake.unshift({ x: x - pixelPerUnit, y });
    snake.pop();
  }

  function right() {
    const { x, y } = snake[0];
    snake.unshift({ x: x + pixelPerUnit, y });
    snake.pop();
  }

  function onKeyDown(event) {
    if (isGameOver) {
      if (event.key === " ") reset();
      return;
    }

    lastNeckPos = snake[1];
    lastTailPos = snake[snake.length - 1];

    if (event.key === "w") top();
    else if (event.key === "s") bottom();
    else if (event.key === "a") left();
    else if (event.key === "d") right();

    snakeEat();

    hasCollision() ? gameOverScreen() : draw();
  }

  socket.on("snake.move", ({ command }) => {
    if (isGameOver) {
      if (command === "reset") reset();
      return;
    }

    lastNeckPos = snake[1];
    lastTailPos = snake[snake.length - 1];

    if (command === "top") top();
    else if (command === "bottom") bottom();
    else if (command === "left") left();
    else if (command === "right") right();

    snakeEat();

    hasCollision() ? gameOverScreen() : draw();
  });

  document.addEventListener("keydown", onKeyDown, false);
</script>

<canvas bind:this="{canvas}"></canvas>
