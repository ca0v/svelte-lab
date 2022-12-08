<script lang="ts">
  import { fade } from "svelte/transition"
  export let sources: Array<string> = []
  export let interval: number = 10000

  let index = 0
  let evenPic = ""
  let oddPic = ""

  let fadeIn = false

  function play() {
    function doit() {
      if (!sources.length) {
        evenPic = oddPic = ""
        return
      }

      fadeIn = 0 === index % 2
      const nextPic = sources[index % sources.length]
      if (index % 2) evenPic = nextPic
      else oddPic = nextPic
      index++
    }
    setInterval(doit, interval)
    doit()
  }

  $: sources.length && play()
</script>

<!-- svelte-ignore a11y-img-redundant-alt -->
<div class="frame" style="--interval: {`${interval}ms`}">
  <img src={evenPic} alt="photo album" in:fade out:fade />
  <img
    class:fadeOut={!fadeIn}
    class:fadeIn
    src={oddPic}
    alt="photo album"
    in:fade
    out:fade
  />
</div>

<style>
  .frame {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .frame > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: rgba(50, 50, 50, 1);
    border-radius: 50%;
  }

  img.fadeOut {
    animation-name: fadeOut;
    animation-duration: var(--interval);
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-direction: normal;
  }

  img.fadeIn {
    animation-name: fadeIn;
    animation-duration: var(--interval);
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-direction: normal;
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    20%,
    to {
      opacity: 0;
      object-position: 50% 50%;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0.1;
    }
    20%,
    to {
      opacity: 1;
    }
  }
</style>
