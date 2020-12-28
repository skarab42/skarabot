<script>
  import io from "socket.io-client";
  import Message from "./Message.svelte";

  const socket = io();

  let apiURL = "https://us-central1-skara-bot.cloudfunctions.net";

  async function fetchTeam(id) {
    const res = await fetch(`${apiURL}/getTeam?userId=${id}`);
    return await res.json();
  }

  async function fetIcon(icon) {
    const res = await fetch(
      `https://skara-bot.web.app/images/teams/${icon}.svg`
    );
    const text = await res.text();
    const div = document.createElement("div");
    div.innerHTML = text;
    const svg = div.firstElementChild;
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.querySelectorAll("*").forEach((tag) => {
      tag.removeAttribute("fill");
      tag.removeAttribute("class");
    });
    return { name: icon, svg: div.innerHTML };
  }

  let messages = [];
  let viewers = {};

  async function addViewer(viewer) {
    const json = await fetchTeam(viewer.id);

    let svg = null;

    if (json.team) {
      const icon = await fetIcon(json.team);
      svg = icon && icon.svg;
    }

    viewers[viewer.id] = { ...json, svg };
  }

  function pushMessage(message) {
    messages = [message, ...messages];
    if (viewers[message.Viewer.id] === undefined) {
      viewers[message.Viewer.id] = null;
      addViewer(message.Viewer);
    }
  }

  function onTeamChange(id) {
    addViewer({ id });
  }

  socket.emit("chat.get-last-messages", { limit: 10 }, (lastMessages) => {
    lastMessages.reverse().forEach(pushMessage);
  });

  socket.on("chat.new-message", pushMessage);

  socket.on("firebase.teamChange", onTeamChange);

  socket.on("viewers.update", (Viewer) => {
    messages = messages.map((message) => {
      if (message.Viewer.id === Viewer.id) {
        message.Viewer = Viewer;
      }
      return message;
    });
  });
</script>

<div class="p-4 flex flex-col space-y-4">
  {#each messages as data (data.id)}
    <Message viewers="{viewers}" data="{data}" />
  {/each}
</div>
