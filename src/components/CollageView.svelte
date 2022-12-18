<script lang="ts">
  const ID_MAP = "QWERTASDFGYUIOPHJKLZXCVBNM!@#$%^&*()".split("")
  import { onMount, onDestroy } from "svelte"

  import {
    extractId,
    getEffectiveTransform,
    getLocalStorage,
  } from "../lib/globals"

  import PhotoWheel from "./PhotoWheel.svelte"
  import SvgImage from "./SvgImage.svelte"
  import { asPhotoServiceUrl } from "../data/collageServices"
  import type { CollageCellState, CollageData } from "../data/Api"
  import { addCommand, removeCommand } from "../store/commands"
  import { reportExceptions } from "../store/toasts"

  export let id: string
  export let sources: Array<string> = []
  export let duration = 0.1
  export let readonly = false
  export let transforms: CollageData
  export let transformDelay = 0 // to be moved to configuration

  let play = readonly
  let editmode = !readonly

  let photoWheelComponent: PhotoWheel
  let scope = `hexagon_spiral_${id}`

  function createCssTransforms(size = 20) {
    return Array(size)
      .fill(0)
      .map((_, i) => {
        const t = `translate(${size / 2 - i}em,-12vh)`
        return `transform: ${t} !important;opacity(0);`
      })
      .map((t, i) => `.${scope} .play.i${i} { ${t} }`)
      .join("\n")
  }

  function createInitialCss(size = 20) {
    return Array(size)
      .fill(0)
      .map((_, i) => {
        return `transition-delay: ${i * duration}ms; transition-duration: ${
          (5 + i) * duration
        }s; opacity:1;`
      })
      .map((t, i) => `.${scope} .i${i} { ${t} }`)
      .join("\n")
  }

  // inject css into style tag
  function injectCss(id: string, generator: () => string) {
    let style = document.querySelector(`#${id}`)
    if (!style) {
      style = document.createElement("style")
      style.id = id
      document.head.appendChild(style)
    }
    style.innerHTML = generator()
  }

  function keyDownHandler(e: KeyboardEvent & { currentTarget: HTMLElement }) {
    if (e.altKey) return
    if (e.metaKey) return

    function handled() {
      e.preventDefault()
      e.stopPropagation()
      return true
    }

    handled()

    // get the image that is currently focused
    const image = document.activeElement as SVGImageElement
    const target = image.parentElement.dataset.target
    // get the svgImage from this

    const sourceTransformIndex = transforms?.data?.findIndex(
      (d) => d.target === target
    )
    const sourceTransform =
      sourceTransformIndex >= 0 && transforms.data[sourceTransformIndex]

    if (e.ctrlKey) {
      switch (e.key) {
        case "d":
          // create a duplicate of the svgImage
          if (sourceTransformIndex >= 0) {
            const newId = transforms.data.length + 1
            let clone = transforms.data[sourceTransformIndex]
            clone = JSON.parse(JSON.stringify(clone))
            clone.target = "i" + newId
            clone.transform = `translate(10px, 10px) ${clone.transform}`
            transforms.data.splice(sourceTransformIndex + 1, 0, clone)
            transforms = transforms
          }
          return handled()
      }
      return
    }

    if (sourceTransform) {
      let rotation = 0
      switch (e.key) {
        case "<":
        case ",":
          rotation -= 15
          break
        case ">":
        case ".":
          rotation += 15
          break
      }
      if (rotation) {
        const currentStyle = getEffectiveTransform(sourceTransform.transform)
        sourceTransform.transform = `${currentStyle} rotate(${rotation}deg)`
        transforms = transforms

        return handled()
      }
    }

    if (sourceTransform && image) {
      let { x: x0, y: y0, width: w0, height: h0 } = sourceTransform
      let x = 0
      let y = 0
      let width = 0
      let height = 0

      let resize = false
      switch (e.key) {
        case "Enter":
          image.parentElement.appendChild(image)
          return handled()
        case "Delete":
          sourceTransform.id = ""
          return handled()
        case "ArrowUp":
          y -= 1
          resize = true
          break
        case "ArrowDown":
          y += 1
          resize = true
          break
        case "ArrowLeft":
          x -= 1
          resize = true
          break
        case "ArrowRight":
          x += 1
          resize = true
          break
        case "+":
          width += 2
          height += 2
          x -= 1
          y -= 1
          resize = true
          break
        case "-":
          width -= 2
          height -= 2
          x += 1
          y += 1
          resize = true
          break
        default:
          if (!ID_MAP.includes(e.key.toLocaleUpperCase())) break
          const index = ID_MAP.indexOf(e.key.toLocaleUpperCase())
          const targetImage = transforms.data[index]
          if (!targetImage) break
          if (e.shiftKey) {
            focusTarget(targetImage.target)
            return handled()
          } else {
            swap(targetImage, sourceTransform)
            return handled()
          }
      }

      if (sourceTransform && image && resize) {
        if (e.shiftKey) {
          const currentStyle = getEffectiveTransform(sourceTransform.transform)
          const newStyle = `scale(${1 + width / w0},${
            1 + height / h0
          }) ${currentStyle} translate(${x}px, ${y}px)`
          const currentTransform = transforms.data[sourceTransformIndex]
          currentTransform.transform = newStyle
          transforms = transforms
        } else {
          if (sourceTransformIndex < 0) {
            image.setAttribute("x", x0 + x + "px")
            image.setAttribute("y", y0 + y + "px")
            image.setAttribute("width", w0 + width + "px")
            image.setAttribute("height", h0 + height + "px")
          } else {
            const currentTransform = transforms.data[sourceTransformIndex]
            currentTransform.x += x
            currentTransform.y += y
            currentTransform.width += width
            currentTransform.height += height
            // force update
            transforms = transforms
          }
        }
        return handled()
      }
    }
  }

  async function applyState(id: string) {
    if (!id) return
    if (!transforms) return

    injectCss(`hexagon_spiral_init_${id}`, createInitialCss)
    injectCss(`hexagon_spiral_transitions_${id}`, createCssTransforms)

    const savedState: CollageData = getLocalStorage(id)
    if (savedState) {
      savedState.data.forEach((image, i) => {
        const transform = transforms.data[i]
        if (!transform) return
        transform.id = image.id
        transform.transform = image.transform
        transform.clipPath = image.clipPath
        transform.x = image.x
        transform.y = image.y
        transform.width = image.width
        transform.height = image.height
      })
    }

    replay()
  }

  function replay() {
    play = true
    setTimeout(() => (play = false), transformDelay * 1000)
  }

  function copy(from: CollageCellState, into: CollageCellState) {
    into.id = from.id
    into.x = from.x
    into.y = from.y
    into.width = from.width
    into.height = from.height
    transforms = transforms
  }

  function swap(i1: CollageCellState, i2: CollageCellState) {
    const { id, x, y, width, height } = i1

    i1.id = i2.id
    i1.x = i2.x
    i1.y = i2.y
    i1.width = i2.width
    i1.height = i2.height

    i2.id = id
    i2.x = x
    i2.y = y
    i2.width = width
    i2.height = height

    // forces a render
    transforms = transforms
  }

  function swapHandler(e: CustomEvent) {
    const { mode, target1, target2 } = e.detail
    const t1 = transforms.data.find((i) => i.target === target1)
    if (!t1) {
      console.log("no target image")
      return
    }

    const t2 = transforms.data.find((i) => i.target === target2)
    if (!t2) {
      console.log("no active image")
      return
    }

    switch (mode) {
      case "copy":
        copy(t2, t1)
        break
      default:
        swap(t1, t2)
    }
  }

  onMount(() => {
    applyState(id)
    addCommand({
      name: "Toggle Edit Mode",
      event: "toggle_edit_mode",
      title: "Toggle Edit Mode",
      trigger: {
        key: "/",
      },
      execute: () => {
        editmode = !editmode
      },
    })
  })

  onDestroy(() => {
    removeCommand("toggle_edit_mode")
  })

  function focusTarget(targetName: string) {
    const target = document.querySelector(`[data-target="${targetName}"] image`)
    // @ts-ignore
    target?.focus()
  }
</script>

<div class={scope} on:keydown={reportExceptions(keyDownHandler)}>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <section>
    <svg
      class:border={editmode}
      viewBox="-100 -100 200 200"
      stroke-width="0"
      fill="#000"
    >
      {#if transforms?.data}
        {#each transforms.data as transform, i}
          <SvgImage
            {play}
            {editmode}
            {readonly}
            href={asPhotoServiceUrl(transform)}
            clipPath={transform.clipPath}
            x={transform.x}
            y={transform.y}
            width={transform.width}
            height={transform.height}
            on:swap={swapHandler}
            on:drop={(e) => {
              const id = extractId(e.detail.url)
              transform.id = id
              transforms = transforms
            }}
            target={`${transform.target}`}
            hotkey={ID_MAP[i]}
            style={transform.transform}
            background={{
              stroke: transform.background?.stroke || "none",
              fill: transform.background?.fill || "none",
            }}
          />
        {/each}
      {/if}
    </svg>
  </section>
  {#if !readonly && editmode && transforms}
    <slot />
    <PhotoWheel
      {sources}
      bind:this={photoWheelComponent}
      on:goto={(data) => {
        const { key } = data.detail
        const index = ID_MAP.indexOf(key.toLocaleUpperCase())
        if (index < 0) return
        const transform = transforms.data[index]
        if (transform) {
          focusTarget(transform.target)
        }
      }}
      on:keydown={(data) => {
        const { key, source } = data.detail
        const index = ID_MAP.indexOf(key.toLocaleUpperCase())
        if (index < 0) return
        const targetImage = transforms.data[index]
        if (targetImage) {
          targetImage.id = extractId(source)
          // forces a render
          transforms = transforms
        }
      }}
    />
  {/if}
  {#if !readonly}
    <div class="clone" class:dragging={false}>Clone Here</div>
  {/if}
</div>

<style>
  svg {
    box-sizing: border-box;
    position: relative;
    overflow: visible;
    width: min(100%, 30em);
  }

  svg.border {
    outline: 1px solid green;
  }

  section {
    display: flex;
    grid-auto-flow: row;
    grid-template-columns: 80cqmin;
    justify-content: center;
  }

  .clone {
    position: absolute;
    top: 0;
    left: 0;
    height: 128px;
    width: 128px;
    background-size: cover;
    opacity: 0.5;
    /* center text vertically */
    display: flex;
    align-items: center;
    justify-content: center;
    /* prevent selection */
    user-select: none;
    visibility: hidden;
    clip-path: url(#clip2);
  }

  .clone.dragging {
    visibility: visible;
  }

  .toolbar {
    display: flex;
    justify-content: center;
    gap: 0.5em;
    margin: 0.5em;
  }
</style>
