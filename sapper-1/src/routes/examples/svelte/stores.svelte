<script lang="ts">
  import { like as inc, dislike as dec } from "../../../data/datastores";
  function asCode(val: string) {
    return `<code>${val.replace("\n", "<br/>")}</code>`;
  }
</script>

<style>
  code {
    padding-left: 1em;
  }
  br {
    display: none;
  }
</style>

<h1>Stores</h1>

<button on:click={() => inc()}>Like</button>
<button on:click={() => dec()}>Dislike</button>

<p>A store is an observable that is shared across components.</p>
<figure>
  <figcaption>Increment a counter</figcaption>
  {@html asCode(inc.toString())}
</figure>

<figure>
  <figcaption>See the like and dislike helpers in datastores.ts</figcaption>
  {@html asCode(` // define a store for incrementing/decrementing a counter
import { writable } from "svelte/store";
export const likes = writable(0);
export const like = (segment?: string) => likes.update((v) => v + 1);
export const dislike = (segment?: string) => likes.update((v) => v - 1);
`)}
</figure>
