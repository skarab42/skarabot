<script>
  import io from "socket.io-client";
  import Message from "./Message.svelte";

  const socket = io();

  let messages = [];

  async function pushMessage(message) {
    messages = [message, ...messages];
  }

  socket.emit("chat.get-last-messages", { limit: 10 }, (lastMessages) => {
    lastMessages.reverse().forEach(pushMessage);
  });

  socket.on("chat.new-message", pushMessage);

  socket.on('viewer.teamChange', ({id, ...rest }) => {
    messages = messages.map((message) => {
      if (message.viewer.id === parseInt(id)) {
        message = { ...message, team:{ color: rest.color, name: rest.team } };
      }
      return message;
    });
  })

  function updateViewer(viewer) {
    messages = messages.map((message) => {
      if (message.viewer.id === viewer.id) {
        message.viewer = { ...message.viewer, ...viewer };
      }
      return message;
    });
  }

  socket.on("viewers.update", updateViewer);
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@500&family=Goldman&display=swap" rel="stylesheet">
</svelte:head>

<style>
  :global(.font-goldman) { font-family: 'Goldman', cursive }
  :global(.font-confortaa) { font-family: 'Comfortaa', cursive; }
</style>

<div class="p-4 flex flex-col space-y-4">
  {#each messages as data (data.id)}
    <Message data="{data}" />
  {/each}
</div>
