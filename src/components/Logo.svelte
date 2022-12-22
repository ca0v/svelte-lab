<script lang="ts">
  let play = 0
  ;(async function () {
    function doit() {
      play++
      return play <= 10
    }

    while (doit()) await sleep(100)
  })()

  async function sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }
</script>

<div class="applogo">
  <div class="bold center-text main-title rotate-text">just.be.collage</div>
  <div class="sub-title">
    for use with
    <google>Google Photos</google>
  </div>
  <div class:effect-skew={play >= 5}>
    <div class="logo-panel logo-grid">
      <div
        class="col1 logo-panel no-right-border"
        class:effect-paint-1={play >= 1}
      >
        <div class="selector">1</div>
      </div>
      <div class="col2 logo-panel no-border translucent">
        <div class="logo-panel no-right-border">
          <div class="selector">2</div>
        </div>
        <div class="logo-panel with-border" class:effect-paint-2={play >= 2}>
          <div class="selector">3</div>
        </div>
        <div class="logo-panel no-right-border no-top-border">
          <div class="selector">4</div>
        </div>
        <div class="logo-panel no-top-border">
          <div class="selector">5</div>
        </div>
      </div>
      <div class="logo-panel no-border translucent">
        <div class="logo-panel no-right-border no-top-border">
          <div class="selector">6</div>
        </div>
        <div class="logo-panel no-right-border no-top-border">
          <div class="selector">7</div>
        </div>
        <div
          class="logo-panel no-right-border no-top-border"
          class:effect-paint-2={play >= 3}
        >
          <div class="selector">8</div>
        </div>
        <div class="logo-panel no-top-border no-right-border no-top-border">
          <div class="selector">9</div>
        </div>
      </div>
      <div class="logo-panel no-top-border" class:effect-paint-4={play >= 4}>
        <div class="selector">10</div>
      </div>
    </div>
  </div>
  <slot />
</div>

<style>
  @media (prefers-color-scheme: dark) {
    .applogo {
      --color-background: rgb(60, 64, 67);
      --color-text: rgb(220, 220, 220);
    }
  }

  @media (prefers-color-scheme: light) {
    .applogo {
      --color-background: rgb(220, 220, 220);
      --color-text: rgb(60, 64, 67);
    }
  }

  @media (prefers-contrast: more) {
    .applogo {
      --color-text: rgb(0, 255, 0);
    }
  }

  @media (min-width: 50rem) {
  }

  .applogo {
    --blue: rgb(30, 10, 180);
    --lite-smoke: rgb(220, 220, 220);
    --smoke: rgba(200, 200, 200, 1);
    --dark-smoke: rgb(60, 64, 67);
    --dark: rgb(60, 64, 67);
    --white: white;
    --google-red: #ea4335;
    --google-blue: #4285f4;
    --google-green: #34a853;
    --google-yellow: #fbbc05;
    --black: black;
  }

  .applogo {
    display: grid;
    align-items: center;
    padding: 2rem;
    border-radius: 2em;
    width: min(80vw, 25em);
    margin: 0 auto;
    container-type: inline-size;
  }

  @media (prefers-color-scheme: dark) {
    .applogo {
      --shadow-color: rgba(200, 200, 200, 0.5);
      background-color: var(--dark);
    }

    .applogo > .sub-title {
      color: var(--white);
    }

    .applogo > .main-title {
      color: var(--white);
      text-shadow: 0px 0px 3px var(--black);
    }
  }

  @media (prefers-color-scheme: light) {
    .applogo {
      --shadow-color: var(--dark-smoke);
      background-color: var(--lite-smoke);
    }

    .applogo > .sub-title {
      color: var(--dark-smoke);
    }

    .applogo > .main-title {
      color: var(--dark-smoke);
      text-shadow: 0px 0px 3px var(--white);
    }
  }

  .applogo > .main-title {
    font-family: system-ui;
    font-size: 16cqw;
    text-align: center;
  }

  .applogo > .sub-title {
    font-size: 6cqw;
    text-align: center;
  }

  google {
    font-size: 5cqw;
    font-display: swap;
  }

  .logo-grid {
    width: 30cqw;
    height: 30cqw;
    margin-left: calc(50% - 30cqw / 2);
  }

  .applogo .logo-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .applogo .logo-panel:has(.selector) {
    background-color: #3c4043;
    padding: 0.5cqw;
  }

  .applogo .logo-panel {
    outline: 1cqw solid var(--google-blue);
  }

  .applogo .logo-panel:has(.logo-panel) {
    outline: none;
  }

  .applogo .logo-panel .selector {
    font-size: 3cqw;
    color: transparent;
    text-align: left;
  }

  .sub-title {
    transform: translate(0, -3cqw);
  }

  .effect-skew {
    animation-name: skew;
    animation-fill-mode: forwards;
    animation-duration: 1000ms;
  }
  @keyframes skew {
    to {
      transform: skewX(-12deg);
    }
  }

  @keyframes shadow {
    to {
      box-shadow: 0 1cqw 8cqw 1cqw var(--shadow-color);
    }
  }

  .effect-paint-1 {
    transform: rotate(-5deg) scale(1.1);
    outline: 1cqw solid var(--google-red) !important;
    background-color: var(--google-blue) !important;
    z-index: 1;
    transition-duration: 1000ms;
  }

  .effect-paint-4 {
    background-position: 0cqw 0px;
    background-image: url(/google_photos_icon.png);
    background-color: white !important;
    background-repeat: no-repeat;
    background-size: contain;
    outline: 2cqw solid var(--google-green) !important;
    transform: rotate(5deg) scale(1.1);
    z-index: 1;
    transition-duration: 1000ms;
  }

  .effect-paint-2 {
    animation-name: paint-2;
    animation-fill-mode: forwards;
    animation-duration: 1000ms;
  }
  @keyframes paint-2 {
    to {
      background-color: var(--google-yellow);
    }
  }

  .no-right-border {
    border-right: none !important;
  }

  .no-top-border {
    border-top: none !important;
  }

  .col2 {
    grid-column: 2;
  }
</style>
