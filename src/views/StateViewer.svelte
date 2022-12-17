<script lang="ts">
  import { data } from "../data/stateTemplates"

  const resolution = 200

  // modify a css variable
  document.documentElement.style.setProperty("--resolution", resolution + "px")

  function removeColinearPoints(points: number[][]) {
    const result = [points[0]]
    for (let i = 1; i < points.length - 1; i++) {
      const [x1, y1] = points[i - 1]
      const [x2, y2] = points[i]
      if (x1 !== x2 || y1 !== y2) {
        result.push(points[i])
      }
    }
    result.push(points[points.length - 1])
    if (result.length != points.length) {
    }
    return result
  }

  function normalizeStateData(state_id: string) {
    const stateInfo = data.features.find(
      (f) => f.attributes.STATE_ABBR === state_id
    )
    if (!stateInfo) throw "state not found"

    // normalize the vector data (cannot use MIN_VALUE here...Math.max fails with it)
    let [minx, miny, maxx, maxy] = [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ]
    stateInfo.geometry.rings.forEach((r) => {
      r.forEach((p) => {
        const [x, y] = p
        minx = Math.min(minx, x)
        miny = Math.min(miny, y)
        maxx = Math.max(maxx, x)
        maxy = Math.max(maxy, y)
      })
    })

    const scale = Math.max(maxx - minx, maxy - miny)

    return stateInfo.geometry.rings.map((ring) => {
      const points = ring.map((point) => {
        let [x, y] = point
        x = (x - minx) / scale
        y = 1 - (y - miny) / scale
        return [Math.round(resolution * x), Math.round(resolution * y)]
      })

      // if this state is wider than it is tall, we need to center it vertically
      if (maxx - minx > maxy - miny) {
        const height = 0.5 * resolution * (1 - (maxy - miny) / scale)
        points.forEach((p) => (p[1] -= height))
      } else {
        const width = 0.5 * resolution * (1 - (maxx - minx) / scale)
        points.forEach((p) => (p[0] += width))
      }

      return points
    })
  }

  function asPath(points: number[][]) {
    return points
      .map((p, i) => {
        return `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`
      })
      .join("")
  }
</script>

<div>State Viewer</div>

<svg viewBox={`0 0 ${resolution} ${resolution}`} width="0" height="0">
  <defs>
    {#each data.features as state}
      {#each normalizeStateData(state.attributes.STATE_ABBR) as polygon}
        <svg id={`path_${state.attributes.STATE_ABBR}`}>
          <path
            stroke="#666"
            stroke-width="1em"
            fill="#333"
            d={`${asPath(removeColinearPoints(polygon))} Z`}
          /></svg
        >
      {/each}
      <clipPath id={`clip_${state.attributes.STATE_ABBR}`}>
        {#each normalizeStateData(state.attributes.STATE_ABBR) as polygon}
          <path d={`${asPath(removeColinearPoints(polygon))} Z`} />
        {/each}
      </clipPath>
    {/each}
  </defs>
</svg>

<div class="body">
  <div class="grid-2">
    {#each data.features as state}
      <div class="background">
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <div
          class="square"
          style="clip-path: url(#clip_{state.attributes.STATE_ABBR})"
        />
      </div>
      <svg viewBox="1 1 1000 1000">
        <use xlink:href={`#path_${state.attributes.STATE_ABBR}`} /></svg
      >
    {/each}
  </div>
</div>

<style>
  .body {
    width: 95vw;
    height: 80vmin;
    padding: 1vmin;
    border: 1px solid green;
    overflow: visible;
  }

  .grid-2 {
    display: grid;
    /* confine to the parent height */
    height: 100%;
    overflow: auto;
    grid-template-columns: repeat(auto-fit, var(--resolution));
    grid-gap: clamp(1em, 2vmin, 5em);
    place-items: center;
  }

  .square {
    padding: 0;
    width: var(--resolution);
    height: var(--resolution);
    background-color: tomato;
    opacity: 0.5;
    transition: opacity 0.2s, transform 0.2s, outline 0.2s;
    background-image: url(/svelte-lab/src/assets/default.jpg);
    background-size: contain;
  }

  .background {
    box-sizing: border-box;
    text-align: center;
    background-image: url(/svelte-lab/src/assets/default.jpg);
    background-size: contain;
    background-blend-mode: color-burn;
    background-color: #666;
  }

  .background:hover {
    background-color: #333;
  }
  .background:hover .square {
    opacity: 1;
    transform: scale(1.5);
    z-index: 1;
  }
</style>
