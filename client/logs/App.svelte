<script>
  import ms from "ms";
  import io from "socket.io-client";
  import { fade } from 'svelte/transition';

  const socket = io();

  let logs = [];
  let filters = {
    'question': false,
    'idea': true
  };
  let icons = {
    'question': '⁉️',
    'idea': '‼️'
  };
  let iconColors = {
    'question': 'bg-red-600',
    'idea': 'bg-blue-600'
  };

  let labelClass = "px-2 text-gray-400 bg-purple-700 rounded p-1 cursor-pointer";

  $: filteredLogs = logs.filter(({type}) => filters[type])

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

  function icon(type) {
    return icons[type];
  }

  function iconColor(type) {
    return iconColors[type];
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
    grid-template-columns: 50px 50px 100px auto;
  }
</style>

<div class="pt-5 px-5 flex space-x-2 uppercase">
  <label class="{labelClass}">
    <input type="checkbox" bind:checked={filters.question} />
    <span>question</span>
  </label>
  <label class="{labelClass}">
    <input type="checkbox" bind:checked={filters.idea} />
    <span>ideas</span>
  </label>
</div>

<div class="m-5 flex flex-col space-y-2">
  {#each filteredLogs as {id, type, time, data}}
  <div in:fade out:fade class="flex items-center bg-gray-500 rounded">
    <div class="grid p-2 flex-auto">
      <div>
        <span class="{iconColor(type)} px-2 bg-red-500 rounded-full">
          {icon(type)}
        </span>
      </div>
      <div class="opacity-50">
        {elsapsed(time)}
      </div>
      <div class="font-bold truncate">{data.user}</div>
      <div>
        {data.text}
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
