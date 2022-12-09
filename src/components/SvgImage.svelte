<script lang="ts">
  import { sleep, swap } from "../data/hexagons"

  export let target = "center"
  export let style = ""
  export let hotkey = ""
  export let play = false
  export let href =
    "http://localhost:5000/Photo/get?id=PXL_20220626_011400211.jpg"

  let thisImage: SVGImageElement
  export let fast = false

  export function disableAnimations() {
    fast = true
  }

  export function test() {
    return thisImage
  }

  function mouseDownHandler(e: MouseEvent) {
    const startX = e.screenX
    const startY = e.screenY
    console.log({ e })
    fast = true
    const cloneElement = document.querySelector(".clone") as HTMLDivElement

    const width = cloneElement.offsetWidth
    const height = cloneElement.offsetHeight
    cloneElement.style.width = width + "px"
    cloneElement.style.height = height + "px"

    let [x, y] = [e.pageX - width / 2, e.pageY - height / 2]

    cloneElement.style.top = y + "px"
    cloneElement.style.left = x + "px"
    cloneElement.style.backgroundImage = `url(${href})`

    const onMouseMove = (e: MouseEvent) => {
      cloneElement.classList.add("dragging")
      const scale = 1 //svgDeclaredWidth / svgActualWidth // not sure why this is needed, depends on screen size and size of the hive (grid-template-column: 70cqmin)
      const dx = scale * (e.screenX - startX)
      const dy = scale * (e.screenY - startY)
      cloneElement.style.top = y + dy + "px"
      cloneElement.style.left = x + dx + "px"

      document.elementsFromPoint(e.clientX, e.clientY).forEach((el) => {
        if (el instanceof SVGImageElement) {
          el.classList.add("dropping")
        }
      })
    }

    const onMouseUp = (e: MouseEvent) => {
      cloneElement.classList.remove("dragging")
      cloneElement.style.top = "-1000px"
      cloneElement.style.left = "-1000px"
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      // find image under the mouse
      const x = e.clientX
      const y = e.clientY
      const element = document.elementFromPoint(x, y)
      if (element instanceof SVGImageElement) {
        element.classList.remove("dropping")
        element.focus()
        swap(thisImage, element)
      }
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<image
  tabindex="0"
  class:play
  class:fast
  bind:this={thisImage}
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
    e.currentTarget.setAttribute("href", url)
    e.currentTarget.setAttribute("x", "-25")
    e.currentTarget.setAttribute("y", "-25")
    e.currentTarget.setAttribute("width", "50")
    e.currentTarget.setAttribute("height", "50")
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
<text tabindex="0" class="selector if-focus" textLength="1" {style}
  >{hotkey}{play ? "." : ""}</text
>

<style>
  image {
    transition-timing-function: ease-out;
    opacity: 1;
  }

  image:focus {
    outline: none;
  }

  image.play {
    opacity: 0;
  }

  /*
  get the text element that is a sibling to the focused image
  */
  image:focus + text {
    stroke: #0f0;
  }

  image.dropping + text {
    stroke: #0f0;
  }

  text {
    stroke-width: 0.25px;
    stroke: #fff;
    translate: 0 12px;
    /* prevent selection */
    user-select: none;
  }

  .selector {
    font-size: 0.5em;
    text-anchor: middle;
    fill: #fff;
    text-shadow: 0 0 1em black;
  }

  image:focus,
  image.fast {
    transition-duration: 0ms;
  }
</style>
