<script lang="ts">
  import PhotoScreen from "./components/PhotoScreen.svelte"
  import { photoUrl as PHOTOS } from "./lib/globals"
  import HexagonSpiral from "./components/HexagonSpiral.svelte"
  import { hexagons } from "./data/hexagons"
  type Photo = {
    id: string
    href: string
  }

  let photos: Array<Photo> = []

  ;(async () => {
    const response = await fetch(`${PHOTOS}/list`)
    if (response.ok) {
      const data = (await response.json()) as Array<Photo>
      photos = data
    }
  })()
</script>

<div class="clone dragging">Clone Here</div>

<main>
  <h1>Photos</h1>
  <div class="frame">
    <HexagonSpiral
      id="phase-1"
      duration={0.2}
      {hexagons}
      sources={photos.map((p) => `${PHOTOS}/get?id=${p.id}`)}
    />
    <div class="fit">
      <PhotoScreen sources={photos.map((p) => `${PHOTOS}/get?id=${p.id}`)} />
    </div>

    {#each photos as photo}
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <img
        tabindex="0"
        class="photo"
        src={`${PHOTOS}/get?id=${photo.id}`}
        alt={photo.id}
      />
    {/each}
  </div>
</main>

<style>
  .fit {
    width: 95vmin;
    height: 95vmin;
    opacity: 0.1;
  }
  .frame {
    display: grid;
    justify-content: center;
    gap: 3rem;
    width: clamp(20rem, 50vw, 50rem);
  }

  .photo {
    --border-color: 255, 0, 0;
    width: 100%;
    box-shadow: 0 0 20px rgba(var(--border-color), 1);
    border-style: solid;
    border-width: 1rem;
    border-color: transparent;
    border-radius: 2rem;
    background-color: rgba(var(--border-color), 0.5);
    opacity: 0.5;
  }

  .photo:focus {
    opacity: 1;
  }

  .clone {
    position: absolute;
    top: 0;
    left: 0;
    height: 96px;
    width: 96px;
    border: 1px solid #fff;
    border-radius: 50%;
    background-size: cover;
    opacity: 0.2;
    /* center text vertically */
    display: flex;
    align-items: center;
    justify-content: center;
    /* prevent selection */
    user-select: none;
    visibility: hidden;
  }

  .clone.dragging {
    visibility: visible;
  }
</style>
