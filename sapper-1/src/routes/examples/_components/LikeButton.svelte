<script lang="ts">
  import { likes, like, dislike } from "../../../data/datastores";
  export let topic = "";
</script>

<style>
  button {
    border-radius: 1em;
    padding: 1em;
    border: 0.25em solid transparent;
    background-color: transparent;
    color: blue;
  }

  button:hover {
    border-color: white;
  }

  p {
    display: inline;
  }
</style>

<nav>
  <button on:click={() => like(topic)}>I Like {topic || ''}</button>
  <button on:click={() => dislike(topic)}>I Dislike {topic || ''}</button>
  {#if !!$likes}
    <p>You have {$likes} likes</p>
  {/if}
</nav>
