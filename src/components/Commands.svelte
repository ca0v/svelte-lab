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
  let searchFilter = ""
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

    if (!escapeMode) {
      // is it a normal key?
      if (key.length == 1) {
        // if in an input do not handle if ctrl or alt not pressed
        if (
          !ctrlKey &&
          !altKey &&
          (event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement)
        ) {
          return
        }

        if (
          !ctrlKey &&
          !altKey &&
          !shiftKey &&
          event.target instanceof HTMLSelectElement
        ) {
          return
        }
      } else {
        if (event.target instanceof HTMLButtonElement) {
          switch (key) {
            case "Enter":
            case " ":
            case "Tab":
              return
          }
        }
      }
    }

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
        (trigger.editmode || escapeMode)

      if (match && trigger.preamble) {
        match = trigger.preamble == lastKeyUp
      }

      match = match && !isCommandDisabled(action)

      return match
    })

    if (!potentialActions.length) {
      // do any commands have a matching preamble?
      const matchingPreamble = $commands.filter((action) => {
        const { trigger } = action
        let match = trigger.preamble == key && (trigger.editmode || escapeMode)
        return match
      })
      if (matchingPreamble.length) {
        event.preventDefault()
        event.stopPropagation()
        lastKeyDownHandled = true
      }
      return
    }

    if (
      0 <
      potentialActions.reduce(
        (value, action) => value + (!!executeCommand(action) ? 1 : 0),
        0
      )
    ) {
      event.preventDefault()
      event.stopPropagation()
      lastKeyDownHandled = true
    }
  }

  function executeCommand(command: Command) {
    const handled =
      (!command.disabled || !command.disabled()) &&
      !!command.execute &&
      command.execute(command)

    if (!handled) {
      dispatcher(command.event, { action: command })
    } else {
      toast(command.title)
    }

    return handled
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
      name: "toggle-escape-mode",
      title: "Toggle Escape Mode",
      trigger: { key: "Escape", editmode: true },
      execute: () => {
        searchFilter = ""
        if (escapeMode) {
          escapeMode = isOpen = false
        } else {
          escapeMode = isOpen = true
        }
        return true
      },
    })

    addCommand({
      name: "search-commands",
      title: "Search for a command",
      trigger: { key: "F", isCtrl: true, isShift: true, editmode: true },
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

    removeCommand("toggle-escape-mode")
    removeCommand("toggle-command-menu")
    removeCommand("search-commands")
  })

  function isFilterMatch(searchFilter: string, command: Command) {
    const tokens = searchFilter.toUpperCase().split(" ")
    const match = (command.title + asMenuItem(command)).toUpperCase()
    return (
      tokens.reduce((b, t) => {
        if (b < 0) return b // nothing to find, abort
        const i = match.indexOf(t, b)
        if (i < 0) return i // not found, abort
        return i + t.length // found, continue after last token
      }, 0) > -1
    )
  }

  function getFilteredCommand(searchFilter: string) {
    return $commands.find((c) => isFilterMatch(searchFilter, c))
  }

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
        const command = getFilteredCommand(searchFilter)
        if (command) {
          executeCommand(command)
          isOpen = false
        }
      }}
    />
    <div class="two-columns">
      {#each $commands.filter((c) => (!c.disabled || !c.disabled()) && isFilterMatch(searchFilter, c)) as command}
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
          on:click={() => executeCommand(command)}
          disabled={command.disabled && command.disabled()}
          class:editmode={command.trigger.editmode}
          class:escapemode={!command.trigger.editmode}
        >
          {(command.trigger.editmode ? "" : !escapeMode ? "Esc " : "") +
            asMenuItem(command)}
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
    padding: 1rem;
    padding-top: 0;
    overflow: hidden;
    overflow-y: auto;
    width: 40vh;
    height: 80vh;
    transition-duration: 300ms;
  }

  details[open] {
    background-color: var(--color-background-2);
    border-bottom-left-radius: 1rem;
    outline: 1px solid var(--color-border-2);
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
