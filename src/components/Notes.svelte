<script lang="ts">
  export let note = ""
  export let shortcut: CommandTrigger
  import {
    shortcut as registerShortcut,
    type CommandTrigger,
  } from "../store/commands"
</script>

<textarea
  use:registerShortcut={shortcut}
  bind:value={note}
  spellcheck="true"
  title="Describe this story"
/>

<style>
  textarea {
    box-sizing: border-box;
    resize: none;
    height: clamp(3rem, 10vh, 20rem);
    font-size: var(--editor-font-size);
    padding: 0.2rem;
  }
</style>
