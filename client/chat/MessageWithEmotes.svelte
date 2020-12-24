<script>
  export let message;

  const tokens = [];
  const regexp = /(?=\[\:emote\|[1-9][0-9]*\|[^\]]+\])/i;

  const emotePrefix = "[:emote|";

  message.split(regexp).forEach((line) => {
    if (line.startsWith(emotePrefix)) {
      let [tag, text] = line.split("]");
      const [id, name] = tag.slice(emotePrefix.length).split("|");
      tokens.push({ type: "emote", id, name });
      text && tokens.push({ type: "text", text });
    } else {
      tokens.push({ type: "text", text: line });
    }
  });

  function getEmoteURL(id) {
    return `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`;
  }
</script>

<div class="p-2 flex items-center space-x-1">
  {#each tokens as token}
    {#if token.type === 'emote'}
      <img class="inline" src="{getEmoteURL(token.id)}" alt="{token.name}" />
    {:else}
      <div class="inline">{token.text}</div>
    {/if}
  {/each}
</div>
