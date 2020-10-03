<script>
  import { fly } from "svelte/transition";
  import { send, receive, scale, fade } from "../fun/transitions";

  let showCode = true;
  let someList = "apple banana cherry date eggplant fig grape"
    .split(" ")
    .map((v, i) => ({ word: v, selected: 0 == i % 2 }));

  const duration = 500;
</script>

<style>
  label {
    display: block;
    min-width: 20em;
  }
  code {
    width: auto;
  }

  body {
    overflow: hidden;
  }
</style>

<h1>Transition Examples</h1>
<label> <input type="checkbox" bind:checked={showCode} /> Show Code </label>

<body>
  {#if showCode}
    <code transition:fly|local={{ x: 1000, y: 0, duration }}>
      {`transition:fly|local={{ x: 1000, y: 0, duration }}`}
    </code>
  {/if}
</body>

<p>
  I want these labels to slide from the current location into the new position
  but cannot figure out how to do that. They are presently using scale to scale
  down in one location to scale up into another location. I do not like it. Also
  the gap between tags is not shrinking so I set a large width to give some
  motion. The duration is supposedly 2x too long.
</p>

<figure>
  <figcaption>scale</figcaption>
  {#each someList.filter((v) => v.selected) as word (word)}
    <label for transition:scale|local={{ duration }}><input
        type="checkbox"
        bind:checked={word.selected} />{word.word}</label>
  {:else}
    <div>No Fruits have been selected</div>
  {/each}

  {#each someList.filter((v) => !v.selected) as word (word)}
    <label for transition:scale|local={{ duration }}><input
        type="checkbox"
        bind:checked={word.selected} />{word.word}</label>
  {:else}
    <div>No items have been discarded</div>
  {/each}
</figure>
<body>
  {#if showCode}
    <code transition:fly|local={{ x: 1000, y: 0, duration }}>
      {`<label for transition:scale|local={{ duration }}>
<input type="checkbox" bind:checked={word.selected} />{word.word}</label>`}
    </code>
  {/if}
</body>
