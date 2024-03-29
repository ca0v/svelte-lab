<svelte:options accessors={true} />

<script context="module" lang="ts">
  export type Source = {
    id: string
    url: string
  }
</script>

<script lang="ts">
  import { toss } from "@/store/toasts"

  import { createEventDispatcher, onDestroy, onMount } from "svelte"
  import { hasFocus } from "../lib/globals"
  import { polygonPath, polygonToPath, translatePath } from "../lib/paths"
  import { contexts, removeCommand } from "../store/commands"
  const dispatch = createEventDispatcher()

  export let sources: Array<Source> = []
  let container: HTMLElement
  let lastFocusedElement: any = null

  export const focus = () => {
    // set focus to the first focusable element
    const first = lastFocusedElement || container.querySelector("button")
    if (first) {
      first.focus()
    }
  }

  export let activeSource: Source | null = null

  onMount(() => {
    // would only navigate the photo wheel when wanting to copy into the collage
    contexts.copy
      .addCommand({
        event: "goto-next-photo",
        name: "Next photo",
        trigger: {
          key: ".",
        },
        disabled: () => !hasFocus(container),
        execute: () => {
          const target = lastFocusedElement.nextElementSibling as HTMLElement
          if (!target) return
          target.focus()
          return true
        },
      })
      .addCommand({
        event: "goto-previous-photo",
        name: "Previous photo",
        trigger: {
          key: ",",
        },
        disabled: () => !hasFocus(container),
        execute: () => {
          const target =
            lastFocusedElement.previousElementSibling as HTMLElement
          if (!target) return
          target.focus()
          return true
        },
      })
  })

  onDestroy(() => {
    removeCommand("goto-next-photo")
    removeCommand("goto-previous-photo")
  })
</script>

<container bind:this={container}>
  <svg
    viewBox="-100 -100 200 200"
    width="100%"
    height="100%"
    stroke-width="0"
    fill="#000"
  >
    <clipPath id="photowheel_clip">
      <path
        d={polygonToPath(translatePath(polygonPath(8, 50, 22.5), 50, 50))}
      />
    </clipPath>
  </svg>
  {#each sources as source}
    <button
      draggable="true"
      on:dragstart={(e) => {
        if (!e.dataTransfer) throw toss("no dataTransfer")
        e.dataTransfer.dropEffect = "copy"
        e.dataTransfer.setData("application/json", JSON.stringify(source))
      }}
      on:focus={(event) => {
        // keep track of the last focused element
        lastFocusedElement = event.target
        activeSource = source
      }}
      on:click={() => {
        // emit a click event so the parent can handle it
        dispatch("click", source)
      }}
    >
      <img src={source.url} alt="" />
    </button>
  {/each}
</container>

<style>
  container {
    box-sizing: border-box;
    display: grid;
    grid-auto-flow: column;
    gap: 2px;
    overflow-x: scroll;
    align-items: top;
    height: clamp(8rem, 12vh, 15rem);
    border: 1px solid white;
  }

  container button {
    display: grid;
    grid-auto-flow: row;
    width: 10pc;
    overflow: hidden;
    padding: 1px;
  }

  container img {
    width: 100%;
    max-height: 10vh;
    object-fit: contain;
    border-radius: var(--border-radius);
  }
</style>
