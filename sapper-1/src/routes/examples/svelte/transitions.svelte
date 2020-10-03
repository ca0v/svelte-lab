<script>
  import { fly } from "svelte/transition";
  import { send, receive, scale, fade } from "../fun/transitions";

  let visible = false;
  let status = "click me";
  let someList = "apple banana cherry date eggplant fig grape"
    .split(" ")
    .map((v, i) => ({ word: v, selected: 0 == i % 2 }));
</script>

<style>
  label {
    padding: 0.5em;
    display: inline-block;
    min-width: 6em;
  }
</style>

<h1 transition:fade>Transition Examples</h1>
<h2 in:receive={{ key: 'you' }} out:send={{ key: 'you' }}>Transitions!</h2>

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
  <figcaption>scale</figcaption>
  {#each someList.filter((v) => v.selected) as word (word)}
    <label for in:scale out:scale><input
        type="checkbox"
        bind:checked={word.selected} />{word.word}</label>
  {:else}<label for transition:fade>No Fruits have been selected</label>{/each}

  <hr />

  {#each someList.filter((v) => !v.selected) as word (word)}
    <label for in:scale out:scale><input
        type="checkbox"
        bind:checked={word.selected} />{word.word}</label>
  {:else}
    <div transition:fade>Discarded Items</div>
  {/each}
</figure>
