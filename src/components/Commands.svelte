<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy, tick } from "svelte"
  import { log } from "../lib/globals"
  import {
    asKeyboardShortcut,
    commander,
    contexts,
    isCommandDisabled,
    isFilterMatch,
    state as commandState,
    type Command,
  } from "../store/commands"
  import { toast } from "../store/toasts"

  const dispatcher = createEventDispatcher()

  export let isOpen = false

  let searchFilter = ""
  let searchInput: HTMLInputElement

  function executeCommand(command: Command) {
    if (isCommandDisabled(command)) return false
    if (command.execute && command.execute(command)) {
      toast(command.title || command.name)
      return true
    }

    if (!command.event) throw "cannot dispatch command with no event"
    log(`dispatching ${command.event}`)
    dispatcher(command.event, { action: command })
    return true
  }

  onMount(() => {
    // @ts-ignore
    document.addEventListener("execute_command", (event: CustomEvent) => {
      const { detail } = event
      const command = detail.command as Command
      command && executeCommand(command)
    })

    contexts.primary.addCommand({
      name: "Toggle Command Console",
      event: "toggle-command-console",
      trigger: { key: "/", isCtrl: true },
      execute: () => {
        searchFilter = ""
        isOpen = !isOpen
        return true
      },
    })

    contexts.primary.addCommand({
      name: "search-commands",
      title: "Search for a command",
      trigger: {
        key: "/",
        isAlt: true,
      },
      execute: () => {
        isOpen = true
        tick().then(() => {
          searchInput?.focus()
          searchInput?.select()
          commander.play("Esc")
        })
        return true
      },
    })
  })

  onDestroy(() => {})
</script>

<aside class="commands">
  <details bind:open={isOpen}>
    <summary>{$commandState.activeContext || ""} ☰</summary>
    {#if isOpen}
      <slot />
      <input
        class="command-search-input"
        type="text"
        placeholder="search..."
        bind:this={searchInput}
        bind:value={searchFilter}
        on:keydown={(e) => {
          if (e.key !== "Enter") return
          // execute the first command that matches the search filter
          const command = commander
            .getCommands()
            .filter((c) => !isCommandDisabled(c))
            .find((c) => isFilterMatch(searchFilter, c))

          if (command) {
            if (executeCommand(command)) {
              isOpen = false
              command.showInToolbar = true
              commander.update()
            }
          }
        }}
      />
      <div class="two-columns">
        {#each commander.getContexts() as ctx}
          <div class="title hilite col1-2">
            {ctx.command.name}
            &lt;<i>{asKeyboardShortcut(ctx.command.trigger)}</i>&gt;
          </div>
          {#each ctx
            .getCommands()
            .filter((c) => !searchFilter || isFilterMatch(searchFilter, c))
            .sort((a, b) => a.name.localeCompare(b.name)) as command}
            <div
              class={`title ${
                !searchFilter
                  ? ""
                  : isFilterMatch(searchFilter, command)
                  ? "filter-hit"
                  : "filter-miss"
              }`}
              title={command.name}
            >
              {command.title}
            </div>
            <button
              on:click={() => {
                if (executeCommand(command)) {
                  if (!command.showInToolbar) {
                    command.showInToolbar = true
                    commander.update()
                  }
                }
              }}
              disabled={command.disabled && command.disabled()}
              class:editmode={command.trigger?.editmode}
              class:escapemode={!command.trigger?.editmode}
            >
              {asKeyboardShortcut(command.trigger || {})}
            </button>
          {/each}
        {/each}
      </div>
    {/if}
  </details>
</aside>

<style>
  aside {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 100;
    cursor: pointer;
  }

  details {
    padding: 1rem;
    padding-top: 0;
    overflow: hidden;
    overflow-y: auto;
    transition-duration: 300ms;
  }

  details[open] {
    background-color: var(--color-background-2);
    border-bottom-left-radius: 1rem;
    outline: 1px solid var(--color-border-2);
    width: clamp(25rem, 40vh, 35rem);
    height: 80vh;
  }

  details > summary {
    padding: 0.5rem;
    border-radius: 4px;
    list-style: none;
    text-align: right;
  }

  details[open] > summary {
    border-radius: 0;
    text-align: right;
  }

  .two-columns {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 0.25rem;
    transition-delay: 300ms width;
  }

  .col1-2 {
    grid-column: 1 / 3;
  }

  input {
    width: calc(100% - 1rem);
    padding: 0.5rem;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius);
    margin: 0.5rem 0;
  }

  .filter-hit {
    color: var(--color-highlight);
    background-color: var(--color-background-highlight);
  }

  .hilite {
    background-color: var(--color-background-highlight);
  }

  .filter-miss {
    display: none;
  }

  button.editmode:not(:disabled) {
    color: var(--color-highlight);
  }

  button.escapemode:not(:disabled) {
    color: var(--color-primary);
  }

  .title {
    padding: 0.5rem;
    margin-right: 0.5rem;
  }

  /* title with a sibling button that is diabled, works but reported as error */
  /* .title:has(+ button:disabled) {
    color: var(--color-disabled);
  } */
</style>
