<script lang="ts">
  import { onMount } from "svelte"
  import {
    polygonPath,
    polygonToPath,
    queryImagePosition,
    setImagePosition,
    swap,
    type ImagePosition,
  } from "../data/hexagons"
  import PhotoWheel from "./PhotoWheel.svelte"
  import SvgImage from "./SvgImage.svelte"
  export let id = "default"
  export let sources: Array<string> = []
  export let hexagons: {
    id: string
    positions: Array<ImagePosition>
  }
  export let duration = 0.1

  let photoWheelComponent: PhotoWheel
  let svgImages: Array<SvgImage> = []

  const ID_MAP = "ASDFJKQWERTYLOPGHBN".split("")
  const scope = `hexagon_spiral_${id}`

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
  function injectCss(css: string) {
    const style = document.createElement("style")
    style.id = `hexagon_spiral_${id}`
    style.innerHTML = css
    document.head.appendChild(style)
  }

  injectCss(createInitialCss())
  injectCss(createCssTransforms())

  let play = true
  setTimeout(() => (play = false), 1000)

  // assign images to each image element
  function autoAssignImages(urls: string[]) {
    const images = document.querySelectorAll(`.${scope} image`)
    images.forEach((image, i) => {
      const url = urls[i % urls.length]
      image.setAttribute("href", url)
    })
  }

  function addToBlacklist(bannedUrl: string) {
    blacklist.add(bannedUrl)
  }

  function queryImagePositions() {
    // persist image positions
    const images = document.querySelectorAll(`.${scope} image`)
    return Array.from(images).map(queryImagePosition)
  }

  function save(): void {
    // persist blacklist
    localStorage.setItem(
      `${id}.blacklist`,
      JSON.stringify(Array.from(blacklist))
    )

    let positions = queryImagePositions()

    // if hexagons then remove the positions that already match the hexagon positions
    if (hexagons) {
      positions = positions.filter((p) => {
        const match = hexagons.positions.find((h) => {
          return (
            h.url === p.url &&
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
    localStorage.setItem(`${id}.positions`, JSON.stringify(positions))
  }

  function loadImagePositions(): Array<ImagePosition> {
    if (hexagons) {
      return hexagons.positions
    }
    const positions = localStorage.getItem(`${id}.positions`)
    if (positions) {
      return JSON.parse(positions)
    }
    return []
  }

  function getBlacklist(): Set<string> {
    const blacklist = localStorage.getItem(`${id}.blacklist`) || "[]"
    return new Set(JSON.parse(blacklist))
  }

  function keyDownHandler(e: KeyboardEvent & { currentTarget: HTMLElement }) {
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
        e.preventDefault()
      }
      return
    }

    // get the image that is currently focused
    const image = document.activeElement as SVGImageElement
    // get the svgImage from this
    const svgImage = svgImages.find((i) => i.test() === image)
    if (!svgImage) return

    let { x, y, width, height } = queryImagePosition(image)
    switch (e.key) {
      case "ArrowUp":
        y -= 1
        break
      case "ArrowDown":
        y += 1
        break
      case "ArrowLeft":
        x -= 1
        break
      case "ArrowRight":
        x += 1
        break
      case "+":
        width += 2
        height += 2
        x -= 1
        y -= 1
        break
      case "-":
        width -= 2
        height -= 2
        x += 1
        y += 1
        break
      case "Delete":
        addToBlacklist(image.getAttribute("href"))
        break
      case " ":
        // set focus to the photo wheel
        photoWheelComponent.focus()
        break

      default:
        if (!ID_MAP.includes(e.key.toLocaleUpperCase())) return
        const index = ID_MAP.indexOf(e.key.toLocaleUpperCase())
        const targetImage = svgImages[index]
        if (!targetImage) return
        if (e.shiftKey) {
          targetImage.test().focus()
        } else {
          targetImage.disableAnimations()
          swap(targetImage.test(), image)
        }
        break
    }

    image.setAttribute("x", x + "px")
    image.setAttribute("y", y + "px")
    image.setAttribute("width", width + "px")
    image.setAttribute("height", height + "px")

    e.stopPropagation()
    e.preventDefault()
  }

  let blacklist = getBlacklist()

  onMount(() => {
    hexagons?.positions.forEach((p) => {
      const image = queryImage(p.target)
      if (image) {
        setImagePosition(image, p)
      }
    })
  })

  function getImages() {
    if (hexagons) {
      return hexagons.positions.map((location) => location.url)
    }
    return sources.filter((url) => !blacklist.has(url))
  }

  function queryImage(index: number | string): SVGImageElement {
    if (typeof index === "string") {
      return document.querySelector(`.${scope} image[data-target="${index}"]`)
    }
    return document.querySelector(`.${scope} image.i${index}`)
  }
</script>

<div class={scope} on:keydown={keyDownHandler}>
  <section
    on:dragenter={() => {
      console.log("dragenter")
    }}
  >
    <svg viewBox="-100 -100 200 200" stroke-width="0" fill="#000">
      <clipPath id="clip">
        <path d={polygonToPath(polygonPath(6, 21, 30))} />
      </clipPath>
      <SvgImage
        bind:this={svgImages[0]}
        {play}
        target={`i0`}
        hotkey={ID_MAP[0]}
      />
      {#each Array(6).fill(0) as _, i}
        <SvgImage
          bind:this={svgImages[i + 1]}
          {play}
          target={`i${i + 1}`}
          hotkey={ID_MAP[i + 1]}
          style={`transform: rotate(${i * 60}deg) translate(40px, 0) rotate(${
            -i * 60
          }deg)`}
        />
      {/each}
      {#each Array(6).fill(0) as _, i}
        <SvgImage
          {play}
          bind:this={svgImages[i + 7]}
          target={`i${i + 7}`}
          hotkey={ID_MAP[i + 7]}
          style={`transform: rotate(${i * 60}deg) translate(80px, 0) rotate(-${
            i * 60
          }deg) `}
        />
      {/each}
      {#each Array(6).fill(0) as _, i}
        <SvgImage
          {play}
          bind:this={svgImages[i + 13]}
          target={`i${i + 13}`}
          hotkey={ID_MAP[i + 13]}
          style={`transform: rotate(${
            30 + i * 60
          }deg) translate(69.5px, 0) rotate(-${30 + i * 60}deg)`}
        />
      {/each}
    </svg>
    <div class="toolbar">
      <button class="if-focus" data-shortcut="S" on:click={() => save()}
        ><u>S</u>ave</button
      >
      <button
        class="if-focus"
        data-shortcut="C"
        title="Copy settings to clipboard"
        on:click={() => {
          const settings = { id, positions: queryImagePositions() }
          navigator.clipboard.writeText(JSON.stringify(settings))
        }}><u>C</u>opy</button
      >
    </div>
    <div class="if-focus">
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
            targetImage.test().setAttribute("href", source)
          }
        }}
      />
      <button
        on:click={() => {
          autoAssignImages(sources.filter((url) => !blacklist.has(url)))
        }}>Auto Assign</button
      >
    </div>
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

  .if-focus {
    visibility: hidden;
  }

  section:focus-within .if-focus {
    visibility: visible;
  }
</style>
