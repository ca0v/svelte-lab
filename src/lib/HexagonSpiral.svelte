<script lang="ts">
  export let id = "default"
  export let sources: Array<string> = []
  export let duration = 0.1

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
        const t = `translate(${size / 2 - i}em,-10em)`
        return `transform: ${t} !important;opacity(0);`
      })
      .map((t, i) => `.${scope} .play .i${i} { ${t} }`)
      .join("\n")
  }

  function createInitialCss(size = 20) {
    return Array(size)
      .fill(0)
      .map((_, i) => {
        return `transition-delay: ${
          i * 10 * duration
        }ms; transition-duration: ${
          (size / 2) * (1 + Math.random()) * duration
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
    images.forEach((image, i) => {
      image.setAttribute("tabindex", "0")
      image.addEventListener("keydown", (e: KeyboardEvent) => {
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
          default:
            return
        }

        image.setAttribute("x", x.toString())
        image.setAttribute("y", y.toString())
        image.setAttribute("width", width.toString())
        image.setAttribute("height", height.toString())

        e.stopPropagation()
        e.preventDefault()
      })
    })
  }

  function addToBlacklist(bannedUrl: string) {
    blacklist.add(bannedUrl)
  }

  function save(): void {
    // persist blacklist
    localStorage.setItem(
      `${id}.blacklist`,
      JSON.stringify(Array.from(blacklist))
    )
    // persist image positions
    const images = document.querySelectorAll(`.${scope} image`)
    const positions = Array.from(images).map((image) => {
      return {
        url: image.getAttribute("href"),
        x: image.getAttribute("x"),
        y: image.getAttribute("y"),
        width: image.getAttribute("width"),
        height: image.getAttribute("height"),
      }
    })
    localStorage.setItem(`${id}.positions`, JSON.stringify(positions))
  }

  function getImagePositions(): Array<{
    url: string
    x: string
    y: string
    width: string
    height: string
  }> {
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

  $: {
    assignTabIndex()
    const images = sources.filter((url) => !blacklist.has(url))
    console.log({ blacklist, sources, images })
    assignImages(images)
    const positions = getImagePositions()
    positions.forEach((position) => {
      const image = document.querySelector(
        `image[href="${position.url}"]`
      ) as SVGImageElement
      if (image) {
        image.setAttribute("x", position.x)
        image.setAttribute("y", position.y)
        image.setAttribute("width", position.width)
        image.setAttribute("height", position.height)
      }
    })
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
  <button on:click={() => save()}>save</button>
</div>

<style>
  section {
    position: relative;
    left: 25vmin;
    width: 50vmin;
    height: 50vmin;
    overflow: hidden;
  }

  image {
    transition-timing-function: ease-out;
    opacity: 1;
  }

  .play image {
    opacity: 0;
  }

  image:focus {
    transition-delay: 20ms;
    transition-duration: 20ms;
    outline: 1pt solid white;
  }
</style>
