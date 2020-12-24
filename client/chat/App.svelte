<script>
  import io from "socket.io-client";
  import Message from "./Message.svelte";

  const socket = io();

  let messages = [];

  socket.emit("chat.get-last-messages", { limit: 10 }, (lastMessages) => {
    messages = lastMessages;
  });

  socket.on("chat.new-message", (message) => {
    messages = [message, ...messages];
  });

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
