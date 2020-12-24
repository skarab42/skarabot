<script>
  export let viewer;

  let cls;
  export { cls as class };

  const baseURL = "https://static-cdn.jtvnw.net/jtv_user_pictures/";
  $: style = `background-image: url(${baseURL}/${viewer.avatarURL})`;
</script>

{#if viewer.avatarURL}
  <div style="{style}" class="bg-cover bg-center {cls}"></div>
{/if}
