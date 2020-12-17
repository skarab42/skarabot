<script>
  import io from "socket.io-client";
  import Item from "./Item.svelte";

  const socket = io();

  let logs = [];
  let filters = {
    message: true,
    question: true,
    idea: true,
  };

  const isOverlay = window.location.search === "?overlay";

  let labelClass =
    "px-2 text-gray-400 bg-purple-700 rounded p-1 cursor-pointer";

  $: filteredLogs = logs.filter(({ type }) => filters[type]).reverse();

  window.setInterval(() => (logs = logs), 1000);

  // TODO print/log error
  function onError(error) {
    // eslint-disable-next-line
    console.error("ERROR >>>", error);
  }

  function onRemove({ detail: id }) {
    socket.emit("logs.remove", id);
  }

  function update(inputs) {
    logs = inputs;
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
  :global(body) {
    font-family: "Roboto", sans-serif;
    background-color: rgba(0, 0, 0, 0.7);
  }
</style>

{#if !isOverlay}
  <div class="pt-5 px-5 flex space-x-2 uppercase">
    {#each Object.keys(filters) as filter}
      <label class={labelClass}>
        <input
          type="checkbox"
          bind:checked={filters[filter]}
          on:change={onFiltersChange} />
        <span>{filter}</span>
      </label>
    {/each}
  </div>
{/if}

<div class="m-5 flex flex-col space-y-2">
  {#each filteredLogs as item}
    <Item {item} {isOverlay} on:remove={onRemove} />
  {:else}
    <div class="p-2 bg-blue-400">✔ La liste est vide...</div>
  {/each}
</div>
