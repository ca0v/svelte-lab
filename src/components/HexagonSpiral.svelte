<script lang="ts">
  const ID_MAP = "ASDFJKQWERTYLOPGHBN".split("")
  import { onMount } from "svelte"

  import { photoUrl as PHOTOS } from "../lib/globals"
  import {
    polygonPath,
    polygonToPath,
    translatePath,
    type ImagePosition,
  } from "../lib/paths"

  import PhotoWheel from "./PhotoWheel.svelte"
  import SvgImage from "./SvgImage.svelte"
  import { hexagons as hexagonSources } from "../data/hexagons"

  export let id
  export let collageName
  export let sources: Array<string> = []
  export let duration = 0.1
  export let readonly = false
  export let transform: Array<{ i: number; style: string }>
  let play = true
  let editmode = false

  let photoWheelComponent: PhotoWheel
  let svgImages = [] as Array<SvgImage>
  let hexagons = hexagonSources.find((s) => s.id == collageName)
  let scope = `hexagon_spiral_${id}`

  $: if (collageName || transform) {
    hexagons = hexagonSources.find((s) => s.id == collageName)
    replay()
    applyState(id)
  }

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
    svgImages.forEach((image, i) => {
      const url = urls[i % urls.length]
      image.href = url
    })
  }

  function queryImagePositions() {
    // persist image positions
    return svgImages.map((i) => ({
      href: i.href,
      target: i.target,
      ...i.getBBox(),
    }))
  }

  function save(): void {
    let positions = queryImagePositions()

    // if hexagons then remove the positions that already match the hexagon positions
    if (hexagons) {
      positions = positions
        .map((p) => ({ ...p, href: p.href.replace(`${PHOTOS}/get?id=`, "") }))
        .filter((p) => {
          const match = hexagons.positions.find((h) => {
            return (
              h.href === p.href &&
              h.x === p.x &&
              h.y === p.y &&
              h.width === p.width &&
              h.height === p.height &&
              h.target === p.target
            )
          })
          return !match
        })
    }
    localStorage.setItem(`${collageName}.positions`, JSON.stringify(positions))
    editmode = false
  }

  function loadImagePositions(): Array<ImagePosition> {
    const positions = localStorage.getItem(`${collageName}.positions`)
    return JSON.parse(positions || "[]")
  }

  function keyDownHandler(e: KeyboardEvent & { currentTarget: HTMLElement }) {
    let handled = false

    if (e.ctrlKey) return
    if (e.metaKey) return

    if (e.altKey) {
      const key = e.key
      // get any element that has this key as a data-shortcut value
      const element = e.currentTarget.querySelector(
        `[data-shortcut="${key.toUpperCase()}"]`
      ) as HTMLElement
      if (element) {
        element.click()
        handled = true
      }
    }

    if (!handled) {
      switch (e.key) {
        case "/":
          editmode = !editmode
          handled = true
          break
        case " ":
          // set focus to the photo wheel
          photoWheelComponent.focus()
          handled = true
          break
      }
    }

    while (!handled) {
      // get the image that is currently focused
      const image = document.activeElement as SVGImageElement
      if (!image) break
      // get the svgImage from this
      const svgImage = svgImages.find((i) => i.target === image.dataset.target)
      if (!svgImage) {
        break
      }
      let { x, y, width, height } = svgImage.getBBox()
      let resize = false
      switch (e.key) {
        case "Delete":
          svgImage.href = ""
          handled = true
          break
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
          const targetImage = svgImages[index]
          if (!targetImage) break
          if (e.shiftKey) {
            targetImage.focus()
            handled = true
          } else {
            targetImage.fast = true
            swap(targetImage, svgImage)
            handled = true
          }
          break
      }

      if (!handled && resize) {
        image.setAttribute("x", x + "px")
        image.setAttribute("y", y + "px")
        image.setAttribute("width", width + "px")
        image.setAttribute("height", height + "px")
        handled = true
      }
      break
    }

    if (handled) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  function applyState(id: string) {
    replay()

    injectCss(`hexagon_spiral_init_${id}`, createInitialCss)
    injectCss(`hexagon_spiral_tran_${id}`, createCssTransforms)

    hexagons?.positions.forEach((p) => {
      const target = svgImages.find((i) => i && i.target === p.target)
      if (!target) return
      target.href = `${PHOTOS}/get?id=${p.href}`
      target.setBBox(p)
    })

    const savedPositions = loadImagePositions()
    savedPositions.forEach((p) => {
      const target = svgImages.find((i) => i && i.target === p.target)
      if (!target) return
      target.href = `${PHOTOS}/get?id=${p.href}`
      target.setBBox(p)
    })
  }

  function replay() {
    play = true
    setTimeout(() => (play = false), 1000)
  }

  onMount(() => applyState(id))

  function queryImage(index: number | string): SVGImageElement {
    if (typeof index === "string") {
      return document.querySelector(`.${scope} image[data-target="${index}"]`)
    }
    return document.querySelector(`.${scope} image.i${index}`)
  }

  function copy(from: SvgImage, into: SvgImage) {
    into.href = from.href
    into.setBBox(from.getBBox())
  }

  function swap(i1: SvgImage, i2: SvgImage) {
    const href = i1.href
    const bbox = i1.getBBox()
    i1.href = i2.href
    i1.setBBox(i2.getBBox())
    i2.href = href
    i2.setBBox(bbox)
  }

  function swapHandler(e) {
    const { mode, target1, target2 } = e.detail
    const t1 = svgImages.find((i) => i.target === target1)
    if (!t1) {
      console.log("no target image")
      return
    }

    const t2 = svgImages.find((i) => i.target === target2)
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

  function dumpTransforms() {
    const transforms = svgImages.map((image, i) => ({
      i,
      style: image.style + "",
    }))
    return transforms
  }
</script>

<div class={scope} on:keydown={keyDownHandler}>
  {#if !readonly}
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
        const targetImage = svgImages[index]
        if (targetImage) {
          targetImage.href = source
        }
      }}
    />
    <div class="toolbar">
      <button data-shortcut="S" on:click={() => save()}><u>S</u>ave</button>
      <button
        data-shortcut="C"
        title="Copy settings to clipboard"
        on:click={() => {
          const settings = {
            id,
            transform: dumpTransforms(),
            positions: queryImagePositions().map((v) => ({
              ...v,
              href: v.href.replace(`${PHOTOS}/get?id=`, ""),
            })),
          }
          navigator.clipboard.writeText(JSON.stringify(settings))
          editmode = false
        }}><u>C</u>opy</button
      >
      <button
        on:click={() => {
          autoAssignImages(sources)
        }}>Auto Assign</button
      >
    </div>
    <div class="clone" class:dragging={false}>Clone Here</div>
  {/if}
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <section>
    <svg viewBox="-100 -100 200 200" stroke-width="0" fill="#000">
      <defs>
        <g id="hexagon">
          <path d={polygonToPath(polygonPath(6, 22, 30))} />
        </g>
      </defs>
      <clipPath id="clip">
        <path d={polygonToPath(polygonPath(6, 21, 30))} />
      </clipPath>
      <clipPath id="clip2">
        <path
          d={polygonToPath(translatePath(polygonPath(6, 64, 30), 64, 64))}
        />
      </clipPath>
      {#if hexagons}
        {#each transform as style}
          <SvgImage
            bind:this={svgImages[style.i]}
            {play}
            {editmode}
            {readonly}
            on:swap={swapHandler}
            target={`i${style.i}`}
            hotkey={ID_MAP[style.i]}
            style={style.style}
          />
        {/each}
      {/if}
    </svg>
  </section>
</div>

<style>
  svg {
    position: relative;
    overflow: visible;
  }

  section {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: 70cqmin;
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
