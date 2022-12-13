<script lang="ts">
  const ID_MAP = "ASDFJKQWERTYLOPGHBN".split("")

  import {
    photoUrl as PHOTOS,
    setLocalStorage,
    getLocalStorage,
  } from "../lib/globals"
  import { polygonPath, polygonToPath, sleep } from "../lib/paths"

  import PhotoWheel from "./PhotoWheel.svelte"
  import SvgImage from "./SvgImage.svelte"
  import {
    getEffectiveTransform,
    type Hexagon,
    type HexagonData,
  } from "../data/hexagons"

  export let id: string
  export let collageName: string
  export let sources: Array<string> = []
  export let duration = 0.1
  export let readonly = false
  export let transform: Hexagon
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

  // assign images to each image element
  function autoAssignImages(urls: string[]) {
    let j = 0
    for (let i = 0; i < transform.data.length && j < urls.length; i++) {
      const image = transform.data[i]
      if (!image.id) {
        const url = urls[j++]
        image.id = url
      }
    }
  }

  function clearAllImages() {
    for (let i = 0; i < transform.data.length; i++) {
      const image = transform.data[i]
      image.id = ""
    }
  }

  function keyDownHandler(e: KeyboardEvent & { currentTarget: HTMLElement }) {
    if (e.altKey) return
    if (e.metaKey) return

    function handled() {
      e.preventDefault()
      e.stopPropagation()
      return true
    }

    const keymap = {
      "/": () => {
        editmode = !editmode
      },
    }

    if (keymap[e.key]) return keymap[e.key]() && handled()

    // get the image that is currently focused
    const image = document.activeElement as SVGImageElement
    const target = image.parentElement.dataset.target
    // get the svgImage from this

    const sourceTransformIndex = transform.data.findIndex(
      (d) => d.target === target
    )
    const sourceTransform = transform.data[sourceTransformIndex]

    if (e.ctrlKey) {
      switch (e.key) {
        case "d":
          // create a duplicate of the svgImage
          if (sourceTransformIndex >= 0) {
            const newId = transform.data.length + 1
            let clone = transform.data[sourceTransformIndex]
            clone = JSON.parse(JSON.stringify(clone))
            clone.target = "i" + newId
            clone.transform = `translate(10px, 10px) ${clone.transform}`
            transform.data.splice(sourceTransformIndex + 1, 0, clone)
            transform = transform
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
        const currentStyle = getEffectiveTransform(sourceTransform)
        sourceTransform.transform = `${currentStyle} rotate(${rotation}deg)`

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
          const targetImage = transform.data[index]
          if (!targetImage) break
          if (e.shiftKey) {
            targetImage.focus = true
            return handled()
          } else {
            targetImage.fast = true
            swap(targetImage, sourceTransform)
            return handled()
          }
      }

      if (sourceTransform && image && resize) {
        if (e.shiftKey) {
          const currentStyle = getEffectiveTransform(sourceTransform)
          const newStyle = `scale(${1 + width / w0},${
            1 + height / h0
          }) ${currentStyle} translate(${x}px, ${y}px)`
          const currentTransform = transform.data[sourceTransformIndex]
          currentTransform.transform = newStyle
          transform.data[sourceTransformIndex] =
            transform.data[sourceTransformIndex]
        } else {
          if (sourceTransformIndex < 0) {
            image.setAttribute("x", x0 + x + "px")
            image.setAttribute("y", y0 + y + "px")
            image.setAttribute("width", w0 + width + "px")
            image.setAttribute("height", h0 + height + "px")
          } else {
            const currentTransform = transform.data[sourceTransformIndex]
            currentTransform.x += x
            currentTransform.y += y
            currentTransform.width += width
            currentTransform.height += height
            transform.data[sourceTransformIndex] =
              transform.data[sourceTransformIndex]
          }
        }
        return handled()
      }
    }
  }

  async function applyState(id: string) {
    injectCss(`hexagon_spiral_init_${id}`, createInitialCss)
    injectCss(`hexagon_spiral_transitions_${id}`, createCssTransforms)

    // HERIIAM: need to wait for svgImages to be set
    await sleep(100)
    const savedState: Hexagon = getLocalStorage(id)
    if (savedState) {
      savedState.data.forEach((image, i) => {
        const svgImage = transform.data[i]
        if (!svgImage) return
        svgImage.id = image.id
        svgImage.transform = image.transform
        svgImage.clipPath = image.clipPath
        svgImage.x = image.x
        svgImage.y = image.y
        svgImage.width = image.width
        svgImage.height = image.height
      })
    }

    replay()
  }

  function replay() {
    play = true
    setTimeout(() => (play = false), transformDelay * 1000)
  }

  function queryImage(index: number | string): SVGImageElement {
    if (typeof index === "string") {
      return document.querySelector(
        `.${scope} .i[data-target="${index}"] > image`
      )
    }
    return document.querySelector(`.${scope} .i${index} > image`)
  }

  function copy(from: HexagonData, into: HexagonData) {
    into.id = from.id
    into.x = from.x
    into.y = from.y
    into.width = from.width
    into.height = from.height
  }

  function swap(i1: HexagonData, i2: HexagonData) {
    const href = i1.id
    const { x, y, width, height } = i1
    i1.id = i2.id
    i1.x = i2.x
    i1.y = i2.y
    i1.width = i2.width
    i1.height = i2.height
    i2.id = href
    i2.x = x
    i2.y = y
    i2.width = width
    i2.height = height
  }

  function swapHandler(e) {
    const { mode, target1, target2 } = e.detail
    const t1 = transform.data.find((i) => i.target === target1)
    if (!t1) {
      console.log("no target image")
      return
    }

    const t2 = transform.data.find((i) => i.target === target2)
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

  function createSettings(): Hexagon {
    return {
      id,
      title: transform.title,
      data: transform.data.map((image) => {
        return {
          target: image.target,
          id: image.id,
          x: image.x,
          y: image.y,
          width: image.width,
          height: image.height,
          transform: image.transform,
          clipPath: image.clipPath,
        }
      }),
    }
  }

  function extractId(href: string): string {
    return href.substring(href.lastIndexOf("id=") + 3)
  }

  $: if (collageName || transform) {
    applyState(id)
  }
</script>

<div class={scope} on:keydown={keyDownHandler}>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <section>
    <svg
      class:border={editmode}
      viewBox="-100 -100 200 200"
      stroke-width="0"
      fill="#000"
    >
      {#if transform?.data}
        {#each transform.data as style, i}
          <SvgImage
            {play}
            {editmode}
            {readonly}
            href={style.id ? `${PHOTOS}/get?id=${style.id}` : ""}
            clipPath={style.clipPath}
            x={style.x}
            y={style.y}
            width={style.width}
            height={style.height}
            on:swap={swapHandler}
            target={`${style.target}`}
            hotkey={ID_MAP[i]}
            style={style.transform}
            background={{
              stroke: style.background?.stroke || "none",
              fill: style.background?.fill || "none",
            }}
          />
        {/each}
      {/if}
    </svg>
  </section>
  {#if !readonly && editmode}
    <div class="toolbar">
      <button
        class="off-screen"
        data-shortcut="F"
        on:click={() =>
          sleep(0).then(() => {
            photoWheelComponent.focus()
          })}><u>F</u>ocus</button
      >
      <button
        class="off-screen"
        data-shortcut="E"
        on:click={() => (editmode = !editmode)}><u>E</u>dit</button
      >
      <button
        data-shortcut="S"
        title="Save to local storage"
        on:click={() => {
          const settings = createSettings()
          setLocalStorage(`${id}`, settings)
          editmode = false
        }}><u>S</u>ave</button
      >
      <button
        data-shortcut="C"
        title="Copy settings to clipboard"
        on:click={() => {
          const settings = createSettings()
          navigator.clipboard.writeText(JSON.stringify(settings, null, 2))
          editmode = false
        }}><u>C</u>opy</button
      >
      <button
        on:click={() => {
          autoAssignImages(sources)
        }}>Auto Assign</button
      >
      <button
        on:click={() => {
          clearAllImages()
        }}>Clear All</button
      >
    </div>
    <slot />
    <PhotoWheel
      {sources}
      bind:this={photoWheelComponent}
      on:goto={(data) => {
        const { key } = data.detail
        const index = ID_MAP.indexOf(key.toLocaleUpperCase())
        if (index < 0) return
        const targetImage = queryImage(index)
        targetImage?.focus()
      }}
      on:keydown={(data) => {
        const { key, source } = data.detail
        const index = ID_MAP.indexOf(key.toLocaleUpperCase())
        if (index < 0) return
        const targetImage = transform.data[index]
        if (targetImage) {
          targetImage.id = source
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
    position: relative;
    overflow: visible;
    width: min(100%, 30em);
  }

  section {
    display: flex;
    grid-auto-flow: row;
    grid-template-columns: 80cqmin;
    justify-content: center;
  }

  svg.border {
    border: 1px solid red;
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
