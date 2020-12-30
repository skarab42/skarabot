<script>
  export let team;

  let svg = null;

  $: if (team) {
    fetchSVG(team.name).then((text) => (svg = text));
  }

  async function fetchSVG(name) {
    const res = await fetch(`/images/teams/${name}.svg`);
    return await res.text();
  }
</script>

{#if svg}
  <div class="ml-2 w-10 h-10" style="fill:{team.color}">
    {@html svg}
  </div>
{/if}
