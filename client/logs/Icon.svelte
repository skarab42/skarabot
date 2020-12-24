<script>
  export let icon;
  export let size = 24;

  $: style = `width:${size}px;height:${size}px;`;
</script>

<div on:click {...$$restProps} style="{style}">
  <svelte:component this="{icon}" />
</div>
