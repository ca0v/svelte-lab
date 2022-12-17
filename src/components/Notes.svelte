<script lang="ts">
  export let note = ""
  export let shortcut = ""
</script>

<textarea data-shortcut={shortcut} bind:value={note} spellcheck="true" />

<style>
  textarea {
    box-sizing: border-box;
    resize: none;
    height: clamp(3rem, 10vh, 20rem);
    font-family: monospace;
    font-size: clamp(8px, 1.5cqmin, 16px);
    padding: 0.2rem;
  }
</style>
