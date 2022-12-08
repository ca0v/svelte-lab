<script lang="ts">
  export let sources: Array<string> = []
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
        return `transform: translate(${size / 2 - i}em,-10em) !important;`
      })
      .map((t, i) => `.play .i${i} { ${t} }`)
      .join("\n")
  }

  function createInitialCss(size = 20) {
    return Array(size)
      .fill(0)
      .map((_, i) => {
        return `transition-delay: ${i * 10}ms; transition-duration: ${
          size / 2 - i
        }s;`
      })
      .map((t, i) => `.i${i} { ${t} }`)
      .join("\n")
  }

  // inject css into style tag
  function injectCss(css: string) {
    const style = document.createElement("style")
    style.innerHTML = css
    document.head.appendChild(style)
  }

  injectCss(createInitialCss())
  injectCss(createCssTransforms())

  let play = true
  setTimeout(() => (play = false), 1000)

  // assign images to each image element
  function assignImages(urls: string[]) {
    const images = document.querySelectorAll("image")
    images.forEach((image, i) => {
      image.setAttribute("href", urls[i % urls.length])
    })
  }

  $: assignImages(sources)
</script>

<section class:play>
  <svg
    id="center"
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
</style>
