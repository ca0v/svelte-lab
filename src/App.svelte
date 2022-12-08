<script lang="ts">
  import PhotoScreen from "./lib/PhotoScreen.svelte"
  import { photoUrl as PHOTOS } from "./lib/globals"
  import HexagonSpiral from "./lib/HexagonSpiral.svelte"
  type Photo = {
    id: string
    href: string
  }

  let photos: Array<Photo> = []

  ;(async () => {
    const response = await fetch(`${PHOTOS}/list`)
    if (response.ok) {
      const data = (await response.json()) as Array<Photo>
      console.log(data)
      photos = data
    }
  })()
</script>

<main>
  <h1>Photos</h1>
  <div class="frame">
    <div class="fit">
      <PhotoScreen sources={photos.map((p) => `${PHOTOS}/get?id=${p.id}`)} />
    </div>
    <HexagonSpiral
      id="phase-1"
      duration={1}
      sources={photos.map((p) => `${PHOTOS}/get?id=${p.id}`)}
    />
    <HexagonSpiral
      id="phase-2"
      duration={0.1}
      sources={photos.map((p) => `${PHOTOS}/get?id=${p.id}`).reverse()}
    />
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
</style>
