<script>
  import io from "socket.io-client";

  const socket = io();

  let ranking = [];
  let icons = {};

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

  socket.emit("team.getRanking", setRanking);
  socket.on("team.ranking", setRanking);
</script>

<div class="p-4 text-gray-300 flex space-x-2">
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
</div>
