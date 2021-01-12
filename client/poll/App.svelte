<script>
  import io from "socket.io-client";
  import Items from "./Items.svelte";

  const socket = io();

  let lastUpdateName = null;
  let stopTimeoutId = null;
  let started = false;
  let visible = false;
  let items = [];
  let total = 0;

  $: titleColor = started ? "bg-green-600" : "bg-orange-600";

  function onState(state) {
    started = state.started;
    items = Object.entries(state.items).sort(([, a], [, b]) => {
      return b - a;
    });
    total = items.reduce((acc, [, points]) => acc + Math.abs(points), 0);
    items = items.map(([name, points]) => {
      const percent = total ? Math.round((points / total) * 100) : 0;
      return { name, points, percent };
    });
  }

  function onStart() {
    clearTimeout(stopTimeoutId);
    started = true;
    visible = true;
    // TODO play sound
  }

  function onStop() {
    started = false;
    // TODO play sound
    stopTimeoutId = setTimeout(() => (visible = false), 15000);
  }

  function onUpdate(state) {
    lastUpdateName = state.name;
    onState(state);
  }

  socket.emit("poll.state", onState);

  socket.on("poll.start", onStart);
  socket.on("poll.stop", onStop);
  socket.on("poll.update", onUpdate);
</script>

<div class="p-5 container {visible ? '' : 'hidden'}">
  <div
    class="uppercase text-gray-300 text-4xl text-center {titleColor} rounded"
  >
    {started ? 'started' : 'stopped'}
  </div>
  <Items items="{items}" />
</div>
