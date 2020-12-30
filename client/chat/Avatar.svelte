<script>
  export let viewer;

  let cls;
  export { cls as class };

  const baseURL = "https://static-cdn.jtvnw.net/jtv_user_pictures/";
  $: style = `background-image: url(${baseURL}/${viewer.avatarURL})`;
</script>

{#if viewer.avatarURL}
  <div class="{cls}">
    <div style="{style}" class="w-full h-full bg-cover bg-center"></div>
  </div>
{/if}
