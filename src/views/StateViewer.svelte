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

    let scale = Math.max(maxx - minx, maxy - miny)

    return stateInfo.geometry.rings.map((ring) => {
      return ring.map((point) => {
        let [x, y] = point
        x = (x - minx) / scale
        y = 1 - (y - miny) / scale
        return [Math.round(resolution * x), Math.round(resolution * y)]
      })
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
      <clipPath id={state.attributes.STATE_ABBR}>
        {#each normalizeStateData(state.attributes.STATE_ABBR) as polygon}
          <path d={`${asPath(removeColinearPoints(polygon))} Z`} />
        {/each}
      </clipPath>
    {/each}
  </defs>
</svg>

<div class="grid-2">
  {#each data.features as state}
    <div
      class="square"
      style="clip-path: url(#{state.attributes.STATE_ABBR})"
    />
  {/each}
</div>

<style>
  .grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, max(var(--resolution), 10vw));
    grid-gap: min(1em, 1vmin);
    width: 100vw;
    overflow: hidden;
  }

  .square {
    padding: 0;
    margin: 0;
    width: var(--resolution);
    height: var(--resolution);
    background-color: #393;
    text-align: center;
  }
</style>
