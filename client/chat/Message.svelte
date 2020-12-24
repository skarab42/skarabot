<script>
  import ms from "ms";
  import Avatar from "./Avatar.svelte";
  import MessageWithEmotes from "./MessageWithEmotes.svelte";

  export let data;

  $: time = elsapsed(data.time);
  $: name = data.Viewer ? data.Viewer.name : data.id;

  function dateToTimestamp(time) {
    return new Date(time).getTime();
  }

  function elsapsed(time) {
    const timestamp = dateToTimestamp(time);
    const millis = Date.now() - timestamp;
    return millis > 1000 ? ms(millis) : "now";
  }

  setInterval(() => {
    time = elsapsed(data.time);
  }, 1000);
</script>

<div class="bg-purple-700 bg-opacity-75 text-gray-300 rounded overflow-hidden">
  <div class="flex items-center bg-black bg-opacity-50">
    <Avatar viewer="{data.Viewer}" class="w-10 h-10" />
    <div class="p-2">{name}</div>
    <div class="flex-auto"></div>
    <div class="p-2 opacity-50">{time}</div>
  </div>
  <MessageWithEmotes message="{data.message}" />
</div>
