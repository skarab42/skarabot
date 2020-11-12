<script>
  import ms from "ms";
  import io from "socket.io-client";
  import { fade } from "svelte/transition";

  const socket = io();

  let logs = [];
  let filters = {
    question: true,
    idea: true,
  };
  let icons = {
    question: "⁉️",
    idea: "‼️",
  };
  let iconColors = {
    question: "bg-red-600",
    idea: "bg-blue-600",
  };

  let labelClass =
    "px-2 text-gray-400 bg-purple-700 rounded p-1 cursor-pointer";

  $: filteredLogs = logs.filter(({ type }) => filters[type]).reverse();

  const isOverlay = window.location.search === "?overlay";

  // TODO print/log error
  function onError(error) {
    // eslint-disable-next-line
    console.error("ERROR >>>", error);
  }

  function onRemove(id) {
    socket.emit("logs.remove", id);
  }

  function update(inputs) {
    logs = inputs;
  }

  function elsapsed(timestamp) {
    return ms(Date.now() - timestamp);
  }

  function icon(type) {
    return icons[type];
  }

  function iconColor(type) {
    return iconColors[type];
  }

  function onFiltersChange() {
    socket.emit("logs.filtersChange", filters);
  }

  socket.on("logs.update", update);
  socket.on("logs.filtersChange", (newFilters) => {
    filters = { ...filters, ...newFilters };
  });

  fetch("/logs-api")
    .then((response) => response.json())
    .then(update)
    .catch(onError);
</script>

<style>
  .grid {
    align-items: center;
    grid-template-columns: 30px 100px auto;
  }
</style>

{#if !isOverlay}
  <div class="pt-5 px-5 flex space-x-2 uppercase">
    <label class={labelClass}>
      <input
        type="checkbox"
        bind:checked={filters.question}
        on:change={onFiltersChange} />
      <span>question</span>
    </label>
    <label class={labelClass}>
      <input
        type="checkbox"
        bind:checked={filters.idea}
        on:change={onFiltersChange} />
      <span>ideas</span>
    </label>
  </div>
{/if}

<div class="m-5 flex flex-col space-y-2">
  {#each filteredLogs as { id, type, time, data }}
    <div in:fade out:fade class="flex items-center bg-gray-500 rounded">
      <div class="grid p-2 flex-auto">
        <div>
          <span class="{iconColor(type)} px-2 bg-red-500 rounded-full">
            {icon(type)}
          </span>
        </div>
        <div class="flex flex-col text-center">
          <div class="font-bold truncate">{data.user}</div>
          <div class="opacity-50">{elsapsed(time)}</div>
        </div>
        <div>{data.text}</div>
      </div>
      {#if !isOverlay}
        <div class="p-2 cursor-pointer" on:click={onRemove.bind(null, id)}>
          ❌
        </div>
      {/if}
    </div>
  {:else}
    <div class="p-2 bg-blue-400">✔ Il n'y a pas de question...</div>
  {/each}
</div>
