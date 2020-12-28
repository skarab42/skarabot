<script>
  export let viewer;
  export let viewers;

  let cls;
  export { cls as class };

  $: data = viewers[viewer.id];
</script>

{#if data && !data.error}
  <div class="ml-1 p-1 {cls} overflow-hidden" style="fill:{data.color}">
    {@html data.svg}
  </div>
{/if}
