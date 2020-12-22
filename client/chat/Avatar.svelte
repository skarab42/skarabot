<script>
  export let viewer;

  let cls;
  export { cls as class };

  const baseURL = "https://static-cdn.jtvnw.net/jtv_user_pictures/";
  const url = `${baseURL}/${viewer.avatarURL}`;
  const style = `background-image: url(${url})`;
</script>

{#if viewer.avatarURL}
  <div {style} class="bg-cover bg-center {cls}" />
{/if}
