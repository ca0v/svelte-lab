<script lang="ts">
  import { polygonPath, polygonToPath, translatePath } from "../data/hexagons"

  export let sources: Array<string> = []
</script>

<container>
  <svg
    viewBox="-100 -100 200 200"
    width="100%"
    height="100%"
    stroke-width="0"
    fill="#000"
  >
    <clipPath id="photowheel_clip">
      <path
        d={polygonToPath(translatePath(polygonPath(8, 50, 22.5), 50, 50))}
      />
    </clipPath>
  </svg>
  {#each sources as source}
    <button>
      <img src={source} />
    </button>
  {/each}
</container>

<style>
  container {
    display: grid;
    grid-auto-flow: column;
    gap: 0.5rem;
    width: 80vw;
    overflow-x: scroll;
    padding: 1rem;
    align-items: top;
    height: 160px;
  }

  container button {
    display: grid;
    grid-auto-flow: row;
    width: 10pc;
    overflow: hidden;
    padding: 1px;
  }

  container img {
    width: 100%;
    max-height: 132px;
    object-fit: contain;
    border-radius: 3px;
  }
</style>
