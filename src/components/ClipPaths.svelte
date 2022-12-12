<script>
  import { polygonPath, polygonToPath, translatePath } from "../lib/paths"
  import { svgPaths } from "../lib/globals"
</script>

<svg id="clip-path-defs" width="0" height="0">
  <defs>
    <clipPath id="clip_box">
      <rect x="-25" y="-25" width="50" height="50" />
    </clipPath>
    <clipPath id="clip_0">
      <path d={polygonToPath(polygonPath(6, 21, 0))} />
    </clipPath>
    <clipPath id="poly5_0">
      <path d={polygonToPath(polygonPath(5, 51, 0))} />
    </clipPath>
    <clipPath id="poly5_36">
      <path d={polygonToPath(polygonPath(5, 36, 52))} />
    </clipPath>
    <clipPath id="poly5_36_1">
      <path d={polygonToPath(polygonPath(5, 36, 52 + 36 + 0))} />
    </clipPath>
    <clipPath id="clip_30">
      <path d={polygonToPath(polygonPath(6, 21, 30))} />
    </clipPath>
    <clipPath id="clip2">
      <path d={polygonToPath(translatePath(polygonPath(6, 64, 30), 64, 64))} />
    </clipPath>
    {#each $svgPaths as path}
      <clipPath id={path.id}>
        {@html path.body}
      </clipPath>
    {/each}
  </defs>
</svg>
