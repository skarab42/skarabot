<script>
  import ms from "ms";
  import Team from "./Team.svelte";
  import Avatar from "./Avatar.svelte";
  import { slide } from "svelte/transition";
  import MessageWithEmotes from "./MessageWithEmotes.svelte";

  export let data;

  $: time = elsapsed(data.time);
  $: name = data.viewer.name;

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

<div
  transition:slide|local
  class="bg-black bg-opacity-25 text-gray-300 rounded overflow-hidden"
>
  <div class="flex items-center space-x-2 bg-black bg-opacity-50">
    <Avatar viewer="{data.viewer}" class="w-12 h-12" />
    <Team team="{data.team}" />
    <div class="px-2 font-goldman text-2xl truncate">{name}</div>
    <div class="flex-auto"></div>
    <div class="px-2 opacity-50">{time}</div>
  </div>
  <MessageWithEmotes message="{data.message}" />
</div>
