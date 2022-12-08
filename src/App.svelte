<script lang="ts">
  import PhotoScreen from "./lib/PhotoScreen.svelte"
  type Photo = {
    id: string
    href: string
  }
  const PHOTOS = "http://localhost:5107/Photo"

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
    <PhotoScreen sources={photos.map((p) => `${PHOTOS}/get?id=${p.id}`)} />
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
  .frame {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    max-width: 40rem;
    gap: 3rem;
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
