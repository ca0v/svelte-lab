<script lang="ts">
  const ID_MAP = "ASDFJKQWERTYLOPGHBN".split("")
  import { onMount } from "svelte"

  import { photoUrl as PHOTOS } from "../lib/globals"
  import { polygonPath, polygonToPath, translatePath } from "../lib/paths"

  import PhotoWheel from "./PhotoWheel.svelte"
  import SvgImage from "./SvgImage.svelte"
  import type { Hexagon } from "../data/hexagons"

  export let id: string
  export let collageName: string
  export let sources: Array<string> = []
  export let duration = 0.1
  export let readonly = false
  export let transform: Hexagon
  let play = true
  let editmode = false

  let photoWheelComponent: PhotoWheel
  let svgImages = [] as Array<SvgImage>
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
    svgImages.forEach((image, i) => {
      if (image.href) return
      const url = urls[i % urls.length]
      image.href = url
    })
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

    // get the image that is currently focused
    const image = document.activeElement as SVGImageElement
    // get the svgImage from this
    const svgImage =
      image && svgImages.find((i) => i.target === image.dataset.target)

    while (!handled) {
      if (!image) break
      if (!svgImage) break

      let { x: x0, y: y0, width: w0, height: h0 } = svgImage.getBBox()
      let x = 0
      let y = 0
      let width = 0
      let height = 0

      let resize = false
      switch (e.key) {
        case "Enter":
          image.parentElement.appendChild(image)
          handled = true
          break
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
        if (e.shiftKey) {
          svgImage.style = `${svgImage.style} translate(${x}px, ${y}px)`
          svgImage.style = `scale(${1 + width / w0},${1 + height / h0}) ${
            svgImage.style
          }`
        } else {
          image.setAttribute("x", x0 + x + "px")
          image.setAttribute("y", y0 + y + "px")
          image.setAttribute("width", w0 + width + "px")
          image.setAttribute("height", h0 + height + "px")
        }
        handled = true
      }
      break
    }

    if (!handled) {
      let rotation = 0
      switch (e.key) {
        case "<":
        case ",":
          rotation -= 30
          break
        case ">":
        case ".":
          rotation -= 30
          break
      }
      if (rotation) {
        const currentStyle = svgImage.getEffectiveTransform()
        svgImage.style = `${currentStyle} rotate(${rotation}deg)`
        image.setAttribute("clip-path", "url(#clip_0)")
        handled = true
      }
    }

    if (handled) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  function applyState(id: string) {
    injectCss(`hexagon_spiral_init_${id}`, createInitialCss)
    injectCss(`hexagon_spiral_transitions_${id}`, createCssTransforms)

    // svgImages have not yet been created since they depend on this transform...delete this, right?  set it declaritively?
    replay()
  }

  function replay() {
    play = true
    setTimeout(() => (play = false), 1000)
  }

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

  $: if (collageName || transform) {
    applyState(id)
    console.log({ id, collageName, transform })
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
      <button
        data-shortcut="C"
        title="Copy settings to clipboard"
        on:click={() => {
          const settings = {
            id,
            data: svgImages.map((image) => {
              return {
                target: image.target,
                href: image.href.replace(`${PHOTOS}/get?id=`, ""),
                ...image.getBBox(),
                transform: image.getEffectiveTransform(),
                clipPath: image.getClipPath(),
              }
            }),
          }
          navigator.clipboard.writeText(JSON.stringify(settings, null, 2))
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
      <clipPath id="clip_0">
        <path d={polygonToPath(polygonPath(6, 21, 0))} />
      </clipPath>
      <clipPath id="clip_30">
        <path d={polygonToPath(polygonPath(6, 21, 30))} />
      </clipPath>
      <clipPath id="clip2">
        <path
          d={polygonToPath(translatePath(polygonPath(6, 64, 30), 64, 64))}
        />
      </clipPath>
      {#if transform?.data}
        {#each transform.data as style, i}
          <SvgImage
            bind:this={svgImages[i]}
            {play}
            {editmode}
            {readonly}
            href={`${PHOTOS}/get?id=${style.href}`}
            clippath={style.clipPath}
            x={style.x}
            y={style.y}
            width={style.width}
            height={style.height}
            on:swap={swapHandler}
            target={`${style.target}`}
            hotkey={ID_MAP[i]}
            style={style.transform}
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
