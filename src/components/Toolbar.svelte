<script type="ts">
  import { log } from "@/lib/globals"
  import { asKeyboardShortcut, command, commander } from "../store/commands"

  // how to know when the commander commands have changed?
  let commands = commander.getCommands().filter((c) => c.showInToolbar)
  commander.subscribe(() => {
    commands = commander.getCommands().filter((c) => c.showInToolbar)
    log({ commands })
  })
</script>

<div class="toolbar">
  {#each commands as c, i}
    <button title={c.title} use:command={c.event}
      >{asKeyboardShortcut(c.trigger)}</button
    >
  {/each}
</div>

<style>
  .toolbar {
    --command-width: min(20cqw, 10rem);
    display: grid;
    grid-template-columns: repeat(auto-fit, var(--command-width));
    column-gap: 2px;
    justify-content: center;
    height: 3rem;
  }
</style>
