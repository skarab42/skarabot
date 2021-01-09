<script>
  import io from "socket.io-client";
  import Item from "./Item.svelte";
  import ms from "ms";

  const socket = io();

  let visible = false;

  let items = {};
  let podium = [];
  let countdown = 0;
  let intervalId = null;
  let currentName = null;

  $: {
    const p1 = podium.findIndex((item) => item.name === currentName);
    podium = Object.entries(items)
      .sort(([, a], [, b]) => {
        return b - a;
      })
      .map(([name, points]) => ({ name, points }));
    const p2 = podium.findIndex((item) => item.name === currentName);

    if (p1 !== -1) {
      const diff = p1 - p2;
      console.log(currentName, diff);
    }
  }

  $: total = podium.reduce((acc, { points }) => acc + Math.abs(points), 0);

  socket.emit("poll.get-items", (initialItems) => {
    items = initialItems;
  });

  function tick() {
    countdown--;
    console.log({ countdown });
  }

  socket.on("poll.start", ({ duration }) => {
    visible = true;
    countdown = duration;
    intervalId = setInterval(tick, 1000);
  });

  socket.on("poll.stop", () => {
    clearInterval(intervalId);
    countdown = 0;
  });

  socket.on("poll.new-item", ({ name, points }) => {
    currentName = name;
    items = { ...items, [name]: points };
  });

  socket.on("poll.reset", () => {
    currentName = null;
    items = {};
  });

  socket.on("poll.hide", () => {
    visible = false;
  });
</script>

<div class="px-20 py-5 h-full {visible ? '' : 'hidden'}">
  <div class="container mb-5">
    <div
      class="bg-green-700 text-gray-300 font-bold text-4xl text-center uppercase rounded"
    >
      {countdown ? ms(countdown * 1000) : 'FINI'}
    </div>
  </div>
  <div class="container flex flex-col space-y-2">
    {#each podium as item (item.name)}
      <Item item="{item}" total="{total}" />
    {/each}
  </div>
</div>
