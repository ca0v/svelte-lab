<script lang="ts">
  const ID_MAP = "QWERTASDFGYUIOPHJKLZXCVBNM!@#$%^&*()".split("")

  import {
    extractId,
    getEffectiveTransform,
    getLocalStorage,
  } from "../lib/globals"

  import PhotoWheel from "./PhotoWheel.svelte"
  import SvgImage from "./SvgImage.svelte"
  import { fetchPhotoByIds } from "../data/collageServices"
  import type { CollageCellState, CollageData, Photo } from "../data/Api"
  import { reportExceptions } from "../store/toasts"
  import { refreshTransforms } from "../store/photos"

  export let id: string
  export let sources: Array<string> = []
  export let readonly = false
  export let editmode = !readonly
  export let transforms: CollageData
  export let transformDelay = 0 // to be moved to configuration

  let play = readonly

  let scope = `hexagon_spiral`

  function keyDownHandler(e: KeyboardEvent & { currentTarget: HTMLElement }) {
    if (!editmode) return
    if (e.altKey) return
    if (e.metaKey) return

    function handled() {
      e.preventDefault()
      e.stopPropagation()
    }

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
            let clone = sourceTransform
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
      let { width: w0 } = sourceTransform
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
          resize = true
          break
        case "-":
          width -= 2
          height -= 2
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
          const currentTransform = getEffectiveTransform(
            sourceTransform.transform
          )
          const newTransform = `scale(${
            1 + width / w0
          }) ${currentTransform} translate(${x}px, ${y}px)`
          sourceTransform.transform = newTransform
        } else {
          sourceTransform.x += x || -width / 2
          sourceTransform.y += y || -height / 2
          sourceTransform.width += width
          sourceTransform.height += height
          console.log(sourceTransform)
        }
        // force update
        transforms = transforms
        return handled()
      }
    }
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

  function focusTarget(targetName: string) {
    const target = document.querySelector(`[data-target="${targetName}"] image`)
    // @ts-ignore
    target?.focus()
  }

  $: reportExceptions(() => transforms && refreshTransforms(transforms.data))()
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
            href={transform.baseurl}
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
