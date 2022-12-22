<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy, tick } from "svelte"
  import {
    addCommand,
    commands,
    removeCommand,
    type Command,
  } from "../store/commands"
  import { toast } from "../store/toasts"

  export let watch: Document | Element

  const dispatcher = createEventDispatcher()
  let lastKeyDownHandled = false
  export let isOpen = false
  let escapeMode = false
  let searchFilter = "create"
  let searchInput: HTMLInputElement

  function asMenuItem(action: Command) {
    if (!action.trigger) return "<none>"
    const { key, preamble, isShift, isCtrl, isAlt } = action.trigger
    const keyNameMap = {
      ArrowUp: "↑",
      ArrowDown: "↓",
      ArrowLeft: "←",
      ArrowRight: "→",
      Shift: "Shift",
      Control: "Ctrl",
      Alt: "Alt",
      Escape: "Esc",
      Enter: "Enter",
      " ": "Space",
    }
    const modifiers = [
      isShift && keyNameMap.Shift,
      isCtrl && keyNameMap.Control,
      isAlt && keyNameMap.Alt,
      key ? keyNameMap[key] || key.toUpperCase() : "",
    ]
      .filter(Boolean)
      .join("+")

    if (preamble) {
      return `${keyNameMap[preamble] || preamble.toUpperCase()} ${modifiers}`
    } else {
      return modifiers
    }
  }

  let lastKeyUp = ""
  function keyUpHandler(event: KeyboardEvent) {
    // do not remain in escape mode if user doing other things
    escapeMode = escapeMode && lastKeyDownHandled
    // record the keypress if it was handled
    lastKeyUp = lastKeyDownHandled ? event.key : ""
  }

  function keyDownHandler(event: KeyboardEvent) {
    lastKeyDownHandled = false
    const { key, shiftKey, ctrlKey, altKey } = event
    const potentialActions = $commands.filter((action) => {
      const { trigger } = action
      if (!trigger) return false
      trigger.isAlt = trigger.isAlt || false
      trigger.isCtrl = trigger.isCtrl || false
      trigger.isShift = trigger.isShift || false

      let match =
        (trigger.key == key || !trigger.key) &&
        trigger.isShift == shiftKey &&
        trigger.isCtrl == ctrlKey &&
        trigger.isAlt == altKey &&
        (trigger.editMode || escapeMode)

      if (match && trigger.preamble) {
        match = trigger.preamble == lastKeyUp
      }

      return match
    })

    if (!potentialActions.length) {
      // do any commands have a matching preamble?
      const matchingPreamble = $commands.filter((action) => {
        const { trigger } = action
        let match = trigger.preamble == key && (trigger.editMode || escapeMode)
        return match
      })
      if (matchingPreamble.length) {
        event.preventDefault()
        event.stopPropagation()
        lastKeyDownHandled = true
      }
      return
    }

    potentialActions.forEach(executeCommand)
    if (potentialActions.length) {
      event.preventDefault()
      event.stopPropagation()
      lastKeyDownHandled = true
    }
  }

  function executeCommand(command: Command) {
    const handled = !!command.execute && command.execute(command)
    if (!handled) {
      dispatcher(command.event, { action: command })
      toast(command.title)
    }
  }

  onMount(() => {
    watch?.addEventListener("keydown", keyDownHandler)
    watch?.addEventListener("keyup", keyUpHandler)

    document.addEventListener("execute_command", (event: CustomEvent) => {
      const { detail } = event
      const { eventName } = detail
      const command = $commands.find((c) => c.event == eventName)
      command && executeCommand(command)
    })

    addCommand({
      name: "enter-escape-mode",
      title: "Enter Escape Mode",
      trigger: { key: ":", editMode: true, isCtrl: true, isShift: true },
      execute: () => {
        escapeMode = true
        return true
      },
    })

    addCommand({
      name: "exit-escape-mode",
      title: "Exit Escape Mode",
      trigger: { key: "Escape" },
      execute: () => {
        escapeMode = false
        isOpen = false
        return true
      },
    })

    addCommand({
      name: "toggle-command-menu",
      title: "Close This Menu",
      trigger: { key: "Enter" },
      execute: () => {
        isOpen = !isOpen
      },
    })

    addCommand({
      name: "search-commands",
      title: "Search for a command",
      trigger: { key: "F", isCtrl: true, isShift: true, editMode: true },
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
    watch?.removeEventListener("keydown", keyDownHandler)
    watch?.removeEventListener("keyup", keyUpHandler)

    removeCommand("exit-escape-mode")
    removeCommand("enter-escape-mode")
    removeCommand("toggle-command-menu")
    removeCommand("search-commands")
  })
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
        const command = $commands.find((c) =>
          c.title.toUpperCase().includes(searchFilter.toUpperCase())
        )
        if (command) {
          executeCommand(command)
          isOpen = false
        }
      }}
    />
    <div class="two-columns">
      {#each $commands as command}
        <div
          class:highlight={command.title
            .toUpperCase()
            .includes(searchFilter.toUpperCase())}
          title={command.name}
        >
          {command.title}
        </div>
        <button
          on:click={() => executeCommand(command)}
          class:editmode={command.trigger.editMode}
          class:escapemode={!command.trigger.editMode}
        >
          {asMenuItem(command)}
        </button>
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
    color: transparent;
    padding: 1rem;
    padding-top: 0;
    overflow: hidden;
    overflow-y: auto;
    width: auto;
    max-height: 80vh;
    transition-duration: 300ms;
  }

  details[open] {
    color: white;
    background-color: #333;
    border-bottom-left-radius: 1rem;
    outline: 1px solid #666;
  }

  details > summary {
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    list-style: none;
    font-size: 2em;
  }

  details[open] > summary {
    border-radius: 0;
    text-align: right;
  }

  details > summary.escape-mode {
    color: green;
  }

  .two-columns {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 0.25rem;
  }

  input {
    width: calc(100% - 1rem);
    padding: 0.5rem;
    border: 1px solid #666;
    border-radius: 4px;
    margin: 0.5rem 0;
  }

  .highlight {
    background-color: #666;
  }

  button.editmode {
    color: var(--color-highlight);
  }

  button.escapemode::before {
    content: ": ";
  }
</style>
