<script>
  import ms from "ms";
  import io from "socket.io-client";
  import { fade } from 'svelte/transition';

  const socket = io();

  let logs = [];

  $: filteredLogs = logs.filter(log => ({type}) => type === 'question')

  // TODO print/log error
  function onError(error) {
    // eslint-disable-next-line
    console.error("ERROR >>>", error);
  }

  function onRemove(id) {
    socket.emit('logs.remove', id);
  }

  function update(inputs) {
    logs = inputs
  }

  function elsapsed(timestamp) {
    return ms(Date.now() - timestamp)
  }

  socket.on('logs.update', update)

  fetch("/logs-api")
    .then(response => response.json())
    .then(update)
    .catch(onError);
</script>

<style>
  .grid {
    align-items: center;
    grid-template-columns: 50px 100px auto;
  }
</style>

<div class="m-5 flex flex-col space-y-2">
  {#each filteredLogs as {id, time, data}}
  <div in:fade out:fade class="flex items-center bg-gray-500 rounded">
    <div class="grid p-2 flex-auto">
      <div class="opacity-50">
        {elsapsed(time)}
      </div>
      <div class="font-bold truncate">{data.user}</div>
      <div>
        {data.question}
      </div>
    </div>
    <div class="p-2 cursor-pointer" on:click={onRemove.bind(null, id)}>❌</div>
  </div>
  {:else}
  <div class="p-2 bg-blue-400">
    ✔ Il n'y a pas de question...
  </div>
  {/each}
</div>
