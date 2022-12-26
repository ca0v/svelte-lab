<script type="ts">
  import { asKeyboardShortcut, commands, command } from "../store/commands"
</script>

<div class="toolbar">
  {#each $commands.filter((command) => command.showInToolbar) as c, i}
    <div class="command-button">
      <p>{c.name}</p>
      <button use:command={c.event}>{asKeyboardShortcut(c)}</button>
    </div>
  {/each}
</div>

<style>
  .toolbar {
    --command-width: min(20cqw, 10rem);
    display: grid;
    grid-template-columns: repeat(auto-fit, var(--command-width));
    column-gap: 2px;
    justify-content: center;
  }

  .command-button {
    display: grid;
    grid-template-rows: 1fr 1fr;
    row-gap: 2px;
  }

  .command-button > * {
    width: var(--command-width);
    text-align: center;
    word-wrap: break-word;
  }
</style>
