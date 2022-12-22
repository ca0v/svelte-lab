<script>
  import { svgClipPaths } from "../store/svg"
</script>

<svg id="clip-path-defs" width="0" height="0">
  <defs>
    {#each $svgClipPaths as path}
      <g id={`hover_${path.id}`}>
        {@html path.body}
      </g>
    {/each}
  </defs>
  <defs>
    {#each $svgClipPaths as path}
      <clipPath id={`clip_${path.id}`}>
        {@html path.body}
      </clipPath>
    {/each}
  </defs>
</svg>

<style>
  svg {
    /* do not take up any screen realestate */
    position: absolute;
    width: 0;
    height: 0;
  }
</style>
