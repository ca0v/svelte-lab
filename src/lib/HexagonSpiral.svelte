<script lang="ts">
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

  // put an image inside an svg
  function imageToPath(
    src: string,
    width: number = 1,
    height: number = 1,
    x: number = 0,
    y: number = 0
  ) {
    return `<image href="${src}" width="${width}" height="${height}" x="${x}" y="${y}" />`
  }
</script>

<section>
  <svg
    id="center"
    viewBox="-1 -1 2 2"
    width="100"
    height="100"
    stroke-width="0"
    fill="#ccc"
  >
    <clipPath id="clip">
      <path d={polygonToPath(polygonPath(6, 0.8, 30))} />
    </clipPath>
    <path d={polygonToPath(polygonPath(6, 0.9, 30))} />
    <image
      href="http://localhost:5000/Photo/get?id=PXL_20220626_011400211.jpg"
      width="2"
      height="2"
      x="-1"
      y="-1"
      clip-path="url(#clip)"
    />
  </svg>
  {#each Array(6).fill(0) as _, i}
    <svg
      viewBox="-1 -1 2 2"
      width="100"
      height="100"
      style={`transform: rotate(${i * 60}deg) translate(92px, 0)`}
      fill="green"
    >
      <path d={polygonToPath(polygonPath(6, 1, 30))} />
    </svg>
  {/each}
  {#each Array(6).fill(0) as _, i}
    <svg
      viewBox="-1 -1 2 2"
      width="100"
      height="100"
      style={`transform: rotate(${i * 60}deg) translate(182px, 0)`}
    >
      <path
        d={polygonToPath(polygonPath(6, 0.25, 30))}
        fill="none"
        stroke="red"
      />
    </svg>
  {/each}
  {#each Array(6).fill(0) as _, i}
    <svg
      viewBox="-1 -1 2 2"
      width="100"
      height="100"
      style={`transform: rotate(${30 + i * 60}deg) translate(152px, 0)`}
    >
      <path d={polygonToPath(polygonPath(6, 1, 0))} fill="none" stroke="red" />
    </svg>
  {/each}
</section>

<style>
  section {
    position: relative;
    width: 100vmin;
    height: 100vmin;
    border: 1px solid white;
    overflow: hidden;
  }

  section > svg {
    outline: 1px solid rgba(200, 200, 200, 0.25);
    border-radius: 50%;
    position: absolute;
    top: calc(50vmin - 50px);
    left: calc(50vmin - 50px);
  }
</style>
