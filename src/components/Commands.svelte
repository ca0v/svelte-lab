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
  let lastKeyDownHandled = false
  let isOpen = false
  let escapeMode = false

  function asMenuItem(action: Command) {
    if (!action.trigger) return "<none>"
    const { key, preamble, isShift, isCtrl, isAlt } = action.trigger
    const modifiers = `${isShift ? "Shift+" : ""}${isCtrl ? "Ctrl+" : ""}${
      isAlt ? "Alt+" : ""
    }`

    return `${preamble ? preamble + " " : ""}${modifiers + key}`
  }

  let lastKeyUp = ""
  function keyUpHandler(event: KeyboardEvent) {
    // do not remain in escape mode if user doing other things
    escapeMode = escapeMode && lastKeyDownHandled
    // record the keypress unless it was handled
    lastKeyUp = event.key
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
        trigger.key == key &&
        trigger.isShift == shiftKey &&
        trigger.isCtrl == ctrlKey &&
        trigger.isAlt == altKey

      if (match && trigger.preamble) {
        match = trigger.preamble == lastKeyUp
      }
      return match
    })

    if (!potentialActions.length) {
      // do any commands have a matching preamble?
      const matchingPreamble = $commands.filter((action) => {
        if (!lastKeyUp) return false
        const { trigger } = action
        if (!trigger) return false
        const { preamble } = trigger
        if (!preamble) return false
        return action.trigger?.preamble == key
      })
      if (matchingPreamble) {
        event.preventDefault()
        event.stopPropagation()
        lastKeyDownHandled = true
        console.log("preamble found", matchingPreamble)
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
    <summary class:escape-mode={escapeMode}>☰</summary>
    <div class="two-columns">
      {#each $commands as command}
        <div title={command.name}>{command.title}</div>
        <button on:click={() => executeCommand(command)}>
          {asMenuItem(command)}
        </button>
      {/each}
    </div>
  </details>
</aside>

<style>
  aside {
    position: fixed;
    top: 0;
    left: 0;
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
</style>
