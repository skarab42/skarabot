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
    <Message data="{data}" />
  {/each}
</div>
