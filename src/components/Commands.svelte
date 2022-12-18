<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte"
  import {
    addCommand,
    commands,
    removeCommand,
    type Command,
  } from "../store/commands"
  import { toast } from "../store/toasts"

  export let watch: Document | Element

  const dispatcher = createEventDispatcher()

  function asMenuItem(action: Command) {
    if (!action.trigger) return "<none>"
    const key = action.trigger.key
    const modifiers = `${action.trigger.isShift ? "Shift+" : ""}${
      action.trigger.isCtrl ? "Ctrl+" : ""
    }${action.trigger.isAlt ? "Alt+" : ""}`

    return `${modifiers + key}`
  }

  let lastKeyUp = ""
  let lastKeyDown = ""
  let lastKeyDownHandled = false
  let isOpen = false
  let escapeMode = false

  function keyUpHandler(event: KeyboardEvent) {
    // do not remain in escape mode if user doing other things
    escapeMode = escapeMode && lastKeyDownHandled
    lastKeyUp = event.key
  }

  function keyDownHandler(event: KeyboardEvent) {
    lastKeyDownHandled = false
    lastKeyDown = event.key
    if (!escapeMode && event.key !== "Escape") return
    const { key, shiftKey, ctrlKey, altKey, metaKey } = event
    const potentialActions = $commands.filter((action) => {
      const { trigger } = action
      if (!trigger) return false
      const match =
        trigger.key === key ||
        ("" && trigger.isShift === shiftKey) ||
        (false &&
          trigger.isCtrl === (ctrlKey || metaKey || false) &&
          trigger.isAlt === altKey) ||
        false
      return match
    })

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

    addCommand({
      name: "toggle-escape-mode",
      title: "Toggle Escape Mode",
      trigger: { key: "Escape" },
      execute: () => {
        escapeMode = !escapeMode
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
  })

  onDestroy(() => {
    watch?.removeEventListener("keydown", keyDownHandler)
    watch?.removeEventListener("keyup", keyUpHandler)

    removeCommand("toggle-escape-mode")
    removeCommand("toggle-command-menu")
  })
</script>

<aside class="commands">
  <details bind:open={isOpen}>
    <summary class:escape-mode={escapeMode}>Commands</summary>
    <div class="two-columns">
      {#each $commands as command}
        <div title={command.name}>{command.title}</div>
        <button on:click={() => executeCommand(command)}>
          <code>{asMenuItem(command)}</code>
        </button>
      {/each}
    </div>
  </details>
</aside>

<style>
  .commands {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    padding: 0.5rem;
    border-radius: 0.5rem;
    margin: 0.5rem;
    cursor: pointer;
  }

  .two-columns {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 0.25rem;
  }

  code {
    font-family: monospace;
    font-size: larger;
  }

  details {
    padding: 0.25rem;
    overflow: hidden;
    overflow-y: auto;
    width: auto;
    height: auto;
  }

  details[open] {
    background-color: #333;
    opacity: 1;
  }

  details > summary {
    padding: 0.25rem;
    height: 2rem;
  }

  details > summary.escape-mode {
    background-color: green;
    color: white;
  }
</style>
