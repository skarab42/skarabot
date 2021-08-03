<script>
  export let message;

  const tokens = [];
  const regexp = /(?=\[\:emote\|[a-z_0-9]*\|[^\]]+\])/i;

  const emotePrefix = "[:emote|";

  let textLength = 0;

  message.split(regexp).forEach((line) => {
    if (line.startsWith(emotePrefix)) {
      let [tag, text] = line.split("]");
      const [id, name] = tag.slice(emotePrefix.length).split("|");
      tokens.push({ type: "emote", id, name });
      if (text) {
        textLength += text.length;
        tokens.push({ type: "text", text });
      }
    } else {
      textLength += line.length;
      tokens.push({ type: "text", text: line });
    }
  });

  let fontSize = textLength < 15 ? "text-4xl" : "text-xl";

  function getEmoteURL(id) {
    return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0`;
  }

</script>

<div class="p-2 font-confortaa {fontSize}">
  {#each tokens as token}
    {#if token.type === 'emote'}
      <img class="inline" src="{getEmoteURL(token.id)}" alt="{token.name}" />
    {:else}
      <div class="inline">{token.text}</div>
    {/if}
  {/each}
</div>
