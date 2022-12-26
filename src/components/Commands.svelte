<script lang="ts">
  import {
    createEventDispatcher,
    onMount,
    onDestroy,
    tick,
    getAllContexts,
  } from "svelte"
  import { log } from "../lib/globals"
  import {
    addCommand,
    asKeyboardShortcut,
    commander,
    isFilterMatch,
    removeCommand,
    type Command,
  } from "../store/commands"
  import { toast } from "../store/toasts"

  const dispatcher = createEventDispatcher()

  export let isOpen = false

  let escapeMode = false
  let searchFilter = ""
  let searchInput: HTMLInputElement

  function executeCommand(command: Command) {
    if (isCommandDisabled(command)) return false
    if (command.execute && command.execute(command)) {
      toast(command.title)
      return true
    }

    dispatcher(command.event, { action: command })
    return true
  }

  onMount(() => {
    document.addEventListener("execute_command", (event: CustomEvent) => {
      const { detail } = event
      const { eventName } = detail
      const command = commander.findCommand(eventName)
      command && executeCommand(command)
    })

    addCommand({
      name: "Toggle Escape Mode",
      event: "toggle-escape-mode",
      trigger: { key: "Escape" },
      execute: () => {
        searchFilter = ""
        if (escapeMode) {
          escapeMode = isOpen = false
        } else {
          escapeMode = isOpen = true
        }
        return true
      },
      showInToolbar: true,
    })

    addCommand({
      name: "search-commands",
      title: "Search for a command",
      trigger: {
        preamble: "F",
        key: "F",
      },
      execute: () => {
        isOpen = true
        escapeMode = false
        tick().then(() => {
          searchInput?.focus()
          searchInput?.select()
        })
        return true
      },
    })
  })

  onDestroy(() => {
    removeCommand("toggle-escape-mode")
    removeCommand("toggle-command-menu")
    removeCommand("search-commands")
  })

  function isCommandDisabled(a: Command) {
    return a.disabled && a.disabled()
  }
</script>

<aside class="commands">
  <details bind:open={isOpen}>
    <summary class:escape-mode={escapeMode}>☰</summary>
    <slot />
    <input
      type="text"
      placeholder="search..."
      bind:this={searchInput}
      bind:value={searchFilter}
      on:keydown={(e) => {
        if (e.key !== "Enter") return
        // execute the first command that matches the search filter
        const command = commander
          .getCommands()
          .find((c) => isFilterMatch(searchFilter, c))

        if (command) {
          if (executeCommand(command)) {
            isOpen = false
            command.showInToolbar = true
          }
        }
      }}
    />
    <div class="two-columns">
      {#each commander.getContexts() as ctx}
        <div class="title col1-2">{ctx.command.trigger.key}</div>
        {#each ctx
          .getCommands()
          .filter((c) => isFilterMatch(searchFilter, c)) as command}
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
                command.showInToolbar = true
              }
            }}
            disabled={command.disabled && command.disabled()}
            class:editmode={command.trigger.editmode}
            class:escapemode={!command.trigger.editmode}
          >
            {asKeyboardShortcut(command.trigger)}
          </button>
        {/each}
      {/each}
    </div>
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

  details > summary.escape-mode {
    color: var(--color-highlight);
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
