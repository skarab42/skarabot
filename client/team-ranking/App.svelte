<script>
  import io from "socket.io-client";

  const socket = io();

  let ranking = [];
  let icons = {};
  let chestOwner = null;

  const baseURL = "https://static-cdn.jtvnw.net/jtv_user_pictures/";

  async function fetchSVG(name) {
    const res = await fetch(`/images/teams/${name}.svg`);
    return await res.text();
  }

  async function fetchIcon({ team }) {
    return icons[team] || (await fetchSVG(team));
  }

  function setRanking(newRanking) {
    ranking = newRanking;
  }

  function onChestOwner(owner) {
    chestOwner = owner;
  }

  socket.emit("team.getRanking", setRanking);
  socket.emit("treasureChest.getOwner", onChestOwner);

  socket.on("team.ranking", setRanking);
  socket.on("treasureChest.newOwner", onChestOwner);

</script>

<style>
  .text-shadow {
    line-height: 1em;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.86);
  }

</style>

<!-- <div class="p-4 text-gray-300 flex space-x-2">
  {#each ranking as team (team.id)}
    <div
      class="px-2 flex items-center justify-center bg-gray-700 rounded overflow-hidden shadow-xl"
    >
      <div class="w-10 h-10 text-pink-500 fill-current">
        {#await fetchIcon(team)}
          {team.team}
        {:then svg}
          {@html svg}
        {/await}
      </div>
      <div class="p-2 text-bold text-2xl">{team.messageCount}</div>
    </div>
  {/each}
</div> -->

{#if chestOwner}
  <div
    class="absolute rounded overflow-hidden"
    style="top:340px; width: 100px; height:100px;"
  >
    {#if chestOwner.avatarURL}
      <img src="{baseURL}{chestOwner.avatarURL}" alt="{chestOwner.name}" />
    {:else}
      <div class="text-4xl text-gray-300 text-shadow break-all">
        {chestOwner.name}
      </div>
    {/if}
  </div>
  <img
    class="absolute"
    style="top:290px; left:17px; width: 100px; transform: rotate(15deg)"
    src="images/crown.png"
    alt="crown"
  />
{/if}
