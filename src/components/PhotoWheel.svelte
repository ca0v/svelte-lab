<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { polygonPath, polygonToPath, translatePath } from "../lib/paths"
  const dispatch = createEventDispatcher()
  export let sources: Array<string> = []
  let container: HTMLElement

  let lastFocusedElement: any = null

  export const focus = () => {
    // set focus to the first focusable element
    const first = lastFocusedElement || container.querySelector("button")
    if (first) {
      first.focus()
    }
  }
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
        console.log("dragstart", e)
        e.dataTransfer.dropEffect = "copy"
      }}
      on:dragend={(e) => {
        console.log("dragend", e)
      }}
      on:focus={(event) => {
        // keep track of the last focused element
        lastFocusedElement = event.target
      }}
      on:click={() => {
        // emit a click event so the parent can handle it
        dispatch("click", source)
      }}
      on:keydown={(e) => {
        if (e.shiftKey && e.key !== "Shift") {
          dispatch("goto", { key: e.key })
          return
        }
        dispatch("keydown", { key: e.key, source })
      }}
    >
      <img src={source} />
    </button>
  {/each}
</container>

<style>
  container {
    display: grid;
    grid-auto-flow: column;
    gap: 0.5rem;
    overflow-x: scroll;
    padding: 1rem;
    align-items: top;
    height: 12vh;
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
    border-radius: 3px;
  }
</style>
