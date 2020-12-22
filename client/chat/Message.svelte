<script>
  import ms from "ms";
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
</script>

<div class="bg-purple-700 bg-opacity-75 text-gray-300 rounded">
  <div class="flex items-center bg-black bg-opacity-50 rounded-t">
    <div class="p-2">{name}</div>
    <div class="flex-auto" />
    <div class="p-2">{time}</div>
  </div>
  <MessageWithEmotes message={data.message} />
</div>
