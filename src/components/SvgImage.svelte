<script lang="ts">
  export let target = "center"
  export let style = ""
  export let hotkey = ""
  export let play = false
</script>

<image
  class:play
  on:dragenter={(e) => {
    console.log("dragenter i0")
  }}
  on:dragover={(e) => {
    console.log("dragover i0")
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }}
  on:dragleave={(e) => {
    console.log("dragleave i0")
  }}
  on:drop={(e) => {
    console.log("drop i0")
    const url = e.dataTransfer.getData("text/plain")
    console.log({ url })
    e.currentTarget.setAttribute("href", url)
    e.currentTarget.setAttribute("x", "-25")
    e.currentTarget.setAttribute("y", "-25")
    e.currentTarget.setAttribute("width", "50")
    e.currentTarget.setAttribute("height", "50")
    e.preventDefault()
  }}
  class={target}
  data-target={target}
  href="http://localhost:5000/Photo/get?id=PXL_20220626_011400211.jpg"
  width="50"
  height="50"
  x="-25"
  y="-25"
  clip-path="url(#clip)"
  {style}
/>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<text tabindex="0" class="selector if-focus" textLength="1" {style}
  >{hotkey}{play ? "." : ""}</text
>

<style>
  image {
    transition-timing-function: ease-out;
    opacity: 1;
  }

  image:focus {
    outline: none;
  }

  image.play {
    opacity: 0;
  }

  /*
  get the text element that is a sibling to the focused image
  */
  image:focus + text {
    stroke: #0f0;
  }

  image.dropping + text {
    stroke: #0f0;
  }

  text {
    stroke-width: 0.25px;
    stroke: #fff;
    translate: 0 12px;
    /* prevent selection */
    user-select: none;
  }

  .selector {
    font-size: 0.5em;
    text-anchor: middle;
    fill: #fff;
    text-shadow: 0 0 1em black;
  }

  *:focus-within image {
    transition-duration: 0ms;
  }
</style>
