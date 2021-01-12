<script>
  import Item from "./Item.svelte";

  export let items;
</script>

<div class="mt-5 flex flex-col space-y-5">
  {#each items as item}
    <Item item="{item}" />
  {/each}
</div>
