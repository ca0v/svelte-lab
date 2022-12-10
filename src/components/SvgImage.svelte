<svelte:options accessors={true} />

<script lang="ts">
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let target = "center"
  export let style = ""
  export let hotkey = ""
  export let play = false
  export let href = ""
  export let fast = false
  export let editmode = false
  export let readonly = false

  let active = false

  let thisImage: SVGImageElement

  export function focus() {
    thisImage.focus()
  }

  export function getBBox() {
    const { x, y, width, height } = thisImage.getBBox()
    return { x, y, width, height }
  }

  export function setBBox(box: {
    x: number
    y: number
    width: number
    height: number
  }) {
    thisImage.setAttribute("x", box.x + "px")
    thisImage.setAttribute("y", box.y + "px")
    thisImage.setAttribute("width", box.width + "px")
    thisImage.setAttribute("height", box.height + "px")
  }

  function mouseDownHandler(e: MouseEvent) {
    const startX = e.screenX
    const startY = e.screenY
    fast = true

    // what is the svelte way of accessing the clone element?
    const cloneElement = document.querySelector(".clone") as HTMLDivElement

    const width = cloneElement.offsetWidth
    const height = cloneElement.offsetHeight
    let [x, y] = [e.pageX - width / 2, e.pageY - height / 2]
    cloneElement.style.backgroundImage = `url(${href})`

    const hoverElements = []

    const onMouseMove = (e: MouseEvent) => {
      cloneElement.classList.add("dragging")
      const dx = e.screenX - startX
      const dy = e.screenY - startY
      cloneElement.style.top = y + dy + "px"
      cloneElement.style.left = x + dx + "px"

      hoverElements.forEach((el) => {
        el.classList.remove("dropping")
      })
      hoverElements.length = 0

      document.elementsFromPoint(e.clientX, e.clientY).forEach((el) => {
        if (el instanceof SVGImageElement) {
          el.classList.add("dropping")
          hoverElements.push(el)
        }
      })
    }

    const onMouseUp = (e: MouseEvent) => {
      cloneElement.classList.remove("dragging")
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      // find image under the mouse
      const x = e.clientX
      const y = e.clientY
      const element = document.elementFromPoint(x, y)
      if (element instanceof SVGImageElement) {
        element.classList.remove("dropping")
        element.focus()
        dispatch("swap", {
          target1: element.dataset.target,
          target2: target,
          mode: e.shiftKey ? "copy" : "swap",
        })
      }
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }
</script>

{#if readonly}
  <image
    class:play
    bind:this={thisImage}
    class={target}
    data-target={target}
    {href}
    width="50"
    height="50"
    x="-25"
    y="-25"
    clip-path="url(#clip)"
    {style}
  />
{/if}

{#if !readonly}
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <image
    tabindex="0"
    class:play
    class:fast
    class:editmode
    class:active
    bind:this={thisImage}
    on:focus={() => console.log("focus", (active = true))}
    on:blur={() => (active = false)}
    on:mousedown={mouseDownHandler}
    on:dragstart={(e) => {
      console.log("dragstart never fires")
      e.preventDefault()
    }}
    on:dragover={(e) => {
      console.log("dragover", target)
      e.dataTransfer.dropEffect = "copy"
      e.preventDefault()
    }}
    on:drop={(e) => {
      console.log("drop", target)
      const url = e.dataTransfer.getData("text/plain")
      href = url
      thisImage.setAttribute("x", "-25")
      thisImage.setAttribute("y", "-25")
      thisImage.setAttribute("width", "50")
      thisImage.setAttribute("height", "50")
      focus()
      e.preventDefault()
    }}
    class={target}
    data-target={target}
    {href}
    width="50"
    height="50"
    x="-25"
    y="-25"
    clip-path="url(#clip)"
    {style}
  />

  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <text
    class="selector if-focus"
    class:editmode
    class:active
    textLength="1"
    {style}>{hotkey}{play ? "." : ""}</text
  >

  <use
    class="border"
    class:active
    cx="0"
    cy="0"
    r="21"
    fill="none"
    stroke-width="2"
    {style}
    xlink:href="#hexagon"
  />
{/if}

<style>
  image {
    transition-timing-function: ease-out;
    opacity: 1;
  }

  image:focus,
  image.fast {
    transition-duration: 0ms;
  }

  image.active {
    outline: none;
  }

  .border {
    visibility: hidden;
    stroke: white;
  }

  /*
    select the second sibling of image
  */
  image:hover:not(.active) + .selector + .border {
    opacity: 0.5;
    visibility: visible;
  }

  .border.active {
    visibility: visible;
  }

  image.play {
    opacity: 0;
  }

  .selector {
    fill: #fff;
    font-size: 0.5em;
    stroke-width: 0.25px;
    stroke: #fff;
    text-anchor: middle;
    text-shadow: 0 0 1em black;
    translate: 0 12px;
    user-select: none;
    visibility: hidden;
  }

  .selector.editmode {
    visibility: visible;
  }

  image:focus + .selector {
    stroke: #0f0;
  }

  image.dropping + .selector {
    stroke: #0f0;
  }
</style>
