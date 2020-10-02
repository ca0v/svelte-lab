<script>
  import { fly } from "svelte/transition";
  import { flip } from "svelte/animate";

  let visible = false;
  let status = "click me";
  let someList = "this is a list of words"
    .split(" ")
    .map((v) => ({ word: v, selected: true }));
</script>

<figure>
  <figcaption>fly</figcaption>

  <label> <input type="checkbox" bind:checked={visible} /> {status} </label>

  {#if visible}
    <p
      transition:fly={{ x: -100, y: -200, duration: 2000 }}
      on:introstart={() => (status = 'intro started')}
      on:outrostart={() => (status = 'outro started')}
      on:introend={() => (status = visible)}
      on:outroend={() => (status = visible)}>
      The fly animation will slide in from a given x/y offset
    </p>
  {/if}
</figure>

<figure>
  <figcaption>First,Last,Invert,Play</figcaption>
  {#each someList.filter((v) => v.selected) as word (word)}
    <label for animate:flip><input
        type="checkbox"
        bind:checked={word.selected} />{word.word}</label>
  {/each}

  <hr />

  {#each someList.filter((v) => !v.selected) as word (word)}
    <label for animate:flip><input
        type="checkbox"
        bind:checked={word.selected} />{word.word}</label>
  {/each}
</figure>
