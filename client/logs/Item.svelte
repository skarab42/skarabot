<script>
  import ms from "ms";
  import Icon from "./Icon.svelte";
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import MdAccessTime from "svelte-icons/md/MdAccessTime.svelte";
  import MdDeleteForever from "svelte-icons/md/MdDeleteForever.svelte";

  export let item;
  export let isOverlay = false;

  const dispatch = createEventDispatcher();

  let colors = {
    question: "bg-purple-700",
    idea: "bg-blue-700",
  };

  $: color = colors[item.type];
  $: fontSize = item.data.text.length > 24 ? 24 : 42;
  $: backgroundImage = item.data.avatarURL
    ? `background-image: url(${item.data.avatarURL})`
    : "";

  function elsapsed(timestamp) {
    return ms(Date.now() - timestamp);
  }
</script>

<div
  in:fade
  out:fade
  class="flex items-center {color} bg-opacity-50 text-light rounded">
  <div class="p-2 flex-auto text-xl">
    <div class="flex space-x-2 bg-black bg-opacity-25 rounded overflow-hidden">
      {#if backgroundImage}
        <div
          class="w-10 bg-cover bg-no-repeat bg-right"
          style={backgroundImage} />
      {/if}
      <div class="p-2 font-bold truncate">{item.data.user}</div>
      <div class="p-2 flex items-center space-x-2  opacity-50">
        <Icon icon={MdAccessTime} />
        <span>{elsapsed(item.time)}</span>
      </div>
    </div>
    <div class="p-2" style="font-size:{fontSize}px">{item.data.text}</div>
  </div>
  {#if !isOverlay}
    <div class="p-2 cursor-pointer" on:click={dispatch('remove', item.id)}>
      <Icon icon={MdDeleteForever} size={24} />
    </div>
  {/if}
</div>
