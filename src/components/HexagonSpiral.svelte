<script lang="ts">
  import { onMount } from "svelte"
  export let id = "default"
  export let sources: Array<string> = []
  export let hexagons: {
    id: string
    positions: Array<ImagePosition>
  }
  export let duration = 0.1

  type ImagePosition = {
    target: string
    url: string
    x: number
    y: number
    width: number
    height: number
  }

  const scope = `hexagon_spiral_${id}`

  // function for producing a polygon path
  function polygonPath(
    sides: number,
    radius: number = 0.5,
    rotation: number = 0
  ) {
    const points = []

    rotation *= Math.PI / 180
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * 2 * Math.PI + rotation
      points.push([radius * Math.cos(angle), radius * Math.sin(angle)])
    }
    return points
  }

  // function to convert a polygon path to an svg path "d"
  function polygonToPath(points: Array<[number, number]>) {
    return (
      points
        .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
        .join(" ") + "Z"
    )
  }

  function createCssTransforms(size = 20) {
    return Array(size)
      .fill(0)
      .map((_, i) => {
        const t = `translate(${size / 2 - i}em,-12vh)`
        return `transform: ${t} !important;opacity(0);`
      })
      .map((t, i) => `.${scope} .play .i${i} { ${t} }`)
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
  function assignImages(urls: string[]) {
    const images = document.querySelectorAll(`.${scope} image`)
    images.forEach((image, i) => {
      const url = urls[i % urls.length]
      image.setAttribute("href", url)
    })
  }

  // assign tabindex and keydown event to all images
  function assignTabIndex() {
    const images = document.querySelectorAll(`.${scope} image`)
    images.forEach((image: SVGImageElement, i) => {
      image.setAttribute("tabindex", "0")
      image.addEventListener("keydown", async (e: KeyboardEvent) => {
        let x = parseInt(image.getAttribute("x"))
        let y = parseInt(image.getAttribute("y"))
        let width = parseInt(image.getAttribute("width"))
        let height = parseInt(image.getAttribute("height"))
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
          case " ": {
            // swap this image with the center image
            const centerImage = document.querySelector(
              `.${scope} image.i0`
            ) as SVGImageElement
            const centerInfo = queryImagePosition(centerImage)
            const outerInfo = queryImagePosition(image)
            setImagePosition(centerImage, outerInfo)
            sleep(20).then(() => setImagePosition(image, centerInfo))
            break
          }
          default:
            return
        }

        image.setAttribute("x", x + "px")
        image.setAttribute("y", y + "px")
        image.setAttribute("width", width + "px")
        image.setAttribute("height", height + "px")

        e.stopPropagation()
        e.preventDefault()
      })
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

  function queryImagePosition(image: HTMLElement | SVGElement): ImagePosition {
    return {
      target: image.dataset.target,
      url: image.getAttribute("href"),
      x: parseInt(image.getAttribute("x")),
      y: parseInt(image.getAttribute("y")),
      width: parseInt(image.getAttribute("width")),
      height: parseInt(image.getAttribute("height")),
    }
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

  let blacklist = getBlacklist()

  onMount(() => {
    assignTabIndex()
    const images = getImages()
    assignImages(images)
    const positions = loadImagePositions()
    positions.forEach((position) => {
      const image = document.querySelector(
        `image[href="${position.url}"]`
      ) as SVGImageElement
      if (image) {
        setImagePosition(image, position)
      }
    })
  })

  function setImagePosition(image: SVGImageElement, position: ImagePosition) {
    image.setAttribute("href", position.url)
    image.setAttribute("x", position.x + "px")
    image.setAttribute("y", position.y + "px")
    image.setAttribute("width", position.width + "px")
    image.setAttribute("height", position.height + "px")
  }

  function getImages() {
    if (hexagons) {
      return hexagons.positions.map((location) => location.url)
    }
    return sources.filter((url) => !blacklist.has(url))
  }

  async function sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }
</script>

<div class={scope}>
  <section class:play>
    <svg
      viewBox="-100 -100 200 200"
      width="100%"
      height="100%"
      stroke-width="0"
      fill="#000"
    >
      <clipPath id="clip">
        <path d={polygonToPath(polygonPath(6, 21, 30))} />
      </clipPath>
      <image
        class="i0"
        data-target="center"
        href="http://localhost:5000/Photo/get?id=PXL_20220626_011400211.jpg"
        width="50"
        height="50"
        x="-25"
        y="-25"
        clip-path="url(#clip)"
      />
      {#each Array(6).fill(0) as _, i}
        <image
          class={`i${i + 1}`}
          data-target={`i${i + 1}`}
          href="http://localhost:5000/Photo/get?id=PXL_20220626_011400211.jpg"
          width="50"
          height="50"
          x="-25"
          y="-25"
          clip-path="url(#clip)"
          style={`transform: rotate(${i * 60}deg) translate(40px, 0) rotate(${
            -i * 60
          }deg)`}
        />
      {/each}
      {#each Array(6).fill(0) as _, i}
        <image
          class={`i${i + 7}`}
          data-target={`i${i + 7}`}
          href="http://localhost:5000/Photo/get?id=PXL_20220626_011400211.jpg"
          width="50"
          height="50"
          x="-25"
          y="-25"
          clip-path="url(#clip)"
          style={`transform: rotate(${i * 60}deg) translate(80px, 0) rotate(-${
            i * 60
          }deg) `}
        />
      {/each}
      {#each Array(6).fill(0) as _, i}
        <image
          class={`i${i + 13}`}
          data-target={`i${i + 13}`}
          href="http://localhost:5000/Photo/get?id=PXL_20220626_011400211.jpg"
          width="50"
          height="50"
          x="-25"
          y="-25"
          clip-path="url(#clip)"
          style={`transform: rotate(${
            30 + i * 60
          }deg) translate(69.5px, 0) rotate(-${30 + i * 60}deg)`}
        />
      {/each}
    </svg>
  </section>
  <button on:click={() => save()}>Save</button>
  <button on:click={() => (play = !play)}>{play ? "Play" : "Unplay"}</button>
  <button
    title="Copy settings to clipboard"
    on:click={() => {
      const settings = { id, positions: queryImagePositions() }
      navigator.clipboard.writeText(JSON.stringify(settings))
    }}>Copy</button
  >
</div>

<style>
  svg {
    overflow: visible;
  }
  section {
    position: relative;
    width: 100%;
    height: 100%;
  }

  image {
    transition-timing-function: ease-out;
    opacity: 0.8;
  }

  .play image {
    opacity: 0;
  }

  image:focus {
    outline: 1pt solid white;
    opacity: 1;
    outline-width: 0.25em;
    border-radius: 20%;
  }

  section:focus-within image {
    transition-duration: 0ms;
  }
</style>
