<script type="ts">
  import { log } from "@/lib/globals"
  import { asKeyboardShortcut, commander } from "../store/commands"

  // how to know when the commander commands have changed?
  let commands = commander.getCommands().filter((c) => c.showInToolbar)
  commander.subscribe(() => {
    commands = commander.getCommands().filter((c) => c.showInToolbar)
  })
</script>

<div class="toolbar">
  {#if commands}
    {@const cmds = commands.filter((c) => !!c.event && !!c.trigger)}
    {#if !cmds.length}
      <div class="empty"><slot /></div>
    {:else}
      {#each cmds as c, i}
        <button
          title={asKeyboardShortcut(c.trigger || {})}
          on:click={() => commander.play(c.event || "")}
          >{c.title || c.name}</button
        >
      {/each}
    {/if}
  {/if}
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

  .toolbar > button {
    text-align: top;
  }
</style>
