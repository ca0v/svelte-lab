<script lang="ts">
  import { likes, like, dislike } from "../data/datastores";
  export let segment: string;
</script>

<footer>
  <button on:click={() => like(segment)}>Like</button>
  <button on:click={() => dislike(segment)}>Dislike {segment || ''}</button>
  {#if !!$likes}
    <p>You have {$likes} likes</p>
  {/if}
</footer>
