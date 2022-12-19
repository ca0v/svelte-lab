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
  export let clipPath = ""
  export let x: number
  export let y: number
  export let width: number
  export let height: number
  export let background: { fill: string; stroke: string }

  let active: boolean
  let thisImage: SVGImageElement

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
          target1: element.parentElement.dataset.target,
          target2: target,
          mode: e.shiftKey ? "copy" : "swap",
        })
      }
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  $: thisImage && setBBox({ x, y, width, height })
</script>

{#if readonly}
  <g
    class:play
    class={target}
    style={`transform: ${style}`}
    data-target={target}
  >
    <use
      class="border"
      class:active
      cx="0"
      cy="0"
      r="21"
      fill={background.fill}
      stroke={background.stroke}
      stroke-width="2"
      xlink:href={`#hover_${clipPath}`}
    />
    <image
      {href}
      bind:this={thisImage}
      clip-path={`url(#clip_${clipPath})`}
      height="50"
      width="50"
      x="-25"
      y="-25"
    />
  </g>
{/if}

{#if !readonly}
  <g
    class:play
    class={target}
    style={`transform: ${style}`}
    data-target={target}
  >
    <use
      class="border"
      class:active
      cx="0"
      cy="0"
      r="100"
      fill={background.fill}
      stroke={background.stroke}
      stroke-width="2"
      xlink:href={`#hover_${clipPath}`}
    />

    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <image
      {href}
      bind:this={thisImage}
      class:active
      class:editmode
      class:fast
      clip-path={`url(#clip_${clipPath})`}
      height="50"
      tabindex="0"
      width="50"
      x="-25"
      y="-25"
      on:focus={() => (active = true)}
      on:blur={() => (active = false)}
      on:mousedown={mouseDownHandler}
      on:dragover={(e) => {
        console.log("dragover", target)
        e.dataTransfer.dropEffect = "copy"
        e.preventDefault()
      }}
      on:drop={(e) => {
        const data = JSON.parse(e.dataTransfer.getData("application/json"))
        console.log("drop", target, data)
        dispatch("drop", data)
        active = true
        e.preventDefault()
      }}
    />

    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <text class="selector if-focus" class:editmode class:active textLength="1"
      >{hotkey}{play ? "." : ""}</text
    >
  </g>
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
    stroke: none;
  }

  /* this works, ignore the warnings 
  @ts-ignore
  @csswarn ignore:has
  */
  /* .border:has(+ image:hover:not(.active)) {
    opacity: 0.5;
    stroke: white;
  } */

  .border.active {
    stroke: white;
  }

  .play {
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
</style>
