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
    message: "bg-purple-700",
    question: "bg-red-700",
    idea: "bg-blue-700",
  };

  let badgeColors = {
    vip: "bg-red-600",
    premium: "bg-purple-600",
    subscriber: "bg-blue-600",
    moderator: "bg-green-600",
    broadcaster: "bg-yellow-600",
  };

  $: color = colors[item.type];
  $: fontSize = 24; //item.user.text.length > 24 ? 24 : 42;
  $: backgroundImage = item.user.avatarURL
    ? `background-image: url(${item.user.avatarURL})`
    : "";
  $: badges = item.user.badges ? Object.entries(item.user.badges) : [];

  function elsapsed(timestamp) {
    const millis = Date.now() - timestamp;
    return millis > 1000 ? ms(millis) : "now";
  }

  function getEmoteURL(id) {
    return `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`;
  }

  $: teamIcon = null;

  function getTeamIcon() {
    try {
      const url = `download/icons/${item.user.team.toLowerCase()}.svg`;

      fetch(url).then(async (res) => {
        if (res.status === 200) {
          teamIcon = await res.text();
          const div = document.createElement("div");
          div.innerHTML = teamIcon;
          div.firstChild.removeAttribute("width");
          div.firstChild.removeAttribute("height");
          console.log(div.firstChild);
          teamIcon = div.innerHTML;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (item.user.team) {
    getTeamIcon();
  }
</script>

<div
  in:fade
  out:fade
  class="flex items-center {color} bg-opacity-50 text-light rounded">
  <div class="flex-auto text-xl">
    <div
      class="flex items-center space-x-2 bg-black bg-opacity-25 rounded overflow-hidden">
      {#if backgroundImage}
        <div
          class="w-12 h-12 bg-cover bg-no-repeat bg-center"
          style={backgroundImage} />
      {/if}
      {#if teamIcon}
        <div
          class="p-2 w-12 h-12"
          style="fill:{item.user.color || 'rgba(0,0,0,0.5)'}">
          {@html teamIcon}
        </div>
      {:else if item.user.team}
        <i
          class="p-1 devicon-{item.user.team.toLowerCase()}-plain text-4xl"
          style="color:{item.user.color || 'rgba(0,0,0,0.5)'}" />
      {/if}
      <div class="flex-auto font-bold truncate">{item.user.name}</div>
      <div class="relative w-40">
        {#each badges as [key, val], i}
          <div
            class="absolute text-center origin-center truncate px-10 {badgeColors[key] || 'bg-gray-500'} bg-opacity-75 transform -rotate-45"
            style="top:-5px;left:{i * 20}px;font-size:8px;">
            {key}
            #{val}
          </div>
        {/each}
      </div>
      <div class="flex items-center pr-2 space-x-2 opacity-50">
        <Icon icon={MdAccessTime} />
        <span>{elsapsed(item.time)}</span>
      </div>
    </div>
    <div class="p-2" style="font-size:{fontSize}px">
      {#each item.data.emotes as token}
        {#if token.type === 'emote'}
          <img class="inline" src={getEmoteURL(token.id)} alt={token.name} />
        {:else}{token.text}{/if}
      {/each}
    </div>
  </div>
  {#if !isOverlay}
    <div class="p-2 cursor-pointer" on:click={dispatch('remove', item.id)}>
      <Icon icon={MdDeleteForever} size={24} />
    </div>
  {/if}
</div>
