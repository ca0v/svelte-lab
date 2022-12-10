<script lang="ts">
  import { onMount } from "svelte"
  import { photoUrl as PHOTOS } from "./lib/globals"
  import HexagonSpiral from "./components/HexagonSpiral.svelte"
  type Photo = {
    id: string
    filename: string
    url: string
    created: string
    width: number
    height: number
  }

  let photos: Array<Photo> = []

  async function fetchPhotoList() {
    const response = await fetch(`${PHOTOS}/list`)
    if (response.ok) {
      const data = (await response.json()) as Array<Photo>
      photos = data
    }
  }

  onMount(() => {
    fetchPhotoList()
  })
</script>

<main>
  <h1>Photo Playground</h1>

  <div class="frame">
    <h2>For Editing</h2>
    <HexagonSpiral
      id="phase-1"
      duration={0.2}
      sources={photos.map((p) => `${PHOTOS}/get?id=${p.filename}`)}
    />
  </div>

  <div class="frame">
    <h2>For Viewing</h2>
    <HexagonSpiral id="phase-1" duration={0.2} readonly={true} />
  </div>
</main>

<style>
  .frame {
    display: grid;
    justify-content: center;
    gap: 3rem;
    width: clamp(20rem, 50vw, 50rem);
  }
</style>
