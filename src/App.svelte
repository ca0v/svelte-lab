<script lang="ts">
  import { onMount } from "svelte"
  import { photoUrl as PHOTOS } from "./lib/globals"
  import HexagonSpiral from "./components/HexagonSpiral.svelte"
  import DateRange from "./components/DateRange.svelte"
  import {
    transforms,
    collages,
    type Photo,
    type Hexagon,
  } from "./data/hexagons"

  import AudioRecorder from "./components/AudioRecorder.svelte"
  import Notes from "./components/Notes.svelte"
  import ClipPaths from "./components/ClipPaths.svelte"

  let photos: Array<Photo> = []

  async function fetchPhotoList() {
    const response = await fetch(`${PHOTOS}/list`)
    if (response.ok) {
      const data = (await response.json()) as Array<Photo>
      return data.map((d) => ({
        ...d,
      }))
    }
    throw new Error("Failed to fetch photo list")
  }

  let collageName = ""
  let transformName = ""
  let date_filter_from = ""
  let date_filter_to = ""
  let activeCollage: Hexagon | undefined

  $: {
    date_filter_from && localStorage.setItem("date_filter", date_filter_from)
    collageName && localStorage.setItem("collage_name", collageName)
    activeCollage =
      collageName && collages && collages.find((h) => h.id === collageName)

    const transform = transforms[transformName] as Array<{
      i: string
      style: string
    }>
    if (transform) {
      if (activeCollage) {
        // inject transforms not found in collage
        transform.forEach((t) => {
          const collageInfo = activeCollage.data.find(
            (c) => c.target === "i" + t.i
          )
          if (!collageInfo) {
            console.log("adding transform:", t.i)
            activeCollage.data.push({
              target: "i" + t.i,
              transform: t.style,
              clipPath: "url(#clip_30)",
              height: 100,
              width: 100,
              x: -50,
              y: -50,
              id: "",
            })
          } else {
            console.log("replacing transform:", t.i)
            collageInfo.transform = t.style
          }
        })
      }
    }
  }

  onMount(async () => {
    date_filter_from = localStorage.getItem("date_filter") || ""
    collageName = localStorage.getItem("collage_name") || ""
    photos = await fetchPhotoList()
    date_filter_from =
      date_filter_from || photos[0]?.created.split("T")[0] || ""
  })
</script>

<main>
  <ClipPaths />

  <h1>Photo Playground</h1>

  <div class="frame">
    <h2>For Editing</h2>
    <div class="two-column">
      <p><u>C</u>ollage Name</p>
      <select bind:value={collageName} data-shortcut="C">
        {#each collages as collage}
          <option value={collage.id}>{collage.title} ({collage.id})</option>
        {/each}
      </select>
      {#if activeCollage}
        <p>Title</p>
        <input type="text" bind:value={activeCollage.title} />
      {/if}
      <p><u>T</u>ransform</p>
      <select data-shortcut="T" bind:value={transformName}>
        {#each Object.entries(transforms) as [name]}<option value={name}
            >{name}</option
          >
        {/each}
      </select>
      <p>Audio Recordings</p>
      <AudioRecorder />
      <p>Notes</p>
      <Notes />
    </div>
    <HexagonSpiral
      id={collageName}
      {collageName}
      transform={activeCollage}
      duration={0.01}
      sources={photos
        .filter(
          (p) =>
            !date_filter_from ||
            (date_filter_from <= p.created && p.created <= date_filter_to)
        )
        .map((p) => (p.id ? `${PHOTOS}/get?id=${p.id}` : ""))}
    >
      <DateRange bind:date_filter_from bind:date_filter_to />
    </HexagonSpiral>
  </div>

  {#if true}
    <h2>Preview</h2>
    <div class="frame three-by">
      {#each collages.filter((c) => c.data.length) as collage, i}
        <div class="border">
          <h3 class="fit">{collage.title}</h3>
          <HexagonSpiral
            id={`view_${collage.id}`}
            collageName={collage.id}
            duration={[0.2, 0.3, 0.4][i] || 1}
            readonly={true}
            transform={collage}
            transformDelay={[0.2, 1, 2][i] || 0}
          />
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  .two-column {
    display: grid;
    grid-template-columns: 1fr 7fr;
    grid-template-rows: repeat(3, 2rem);
    grid-gap: 1rem;
    width: clamp(10rem, 90vw, 80rem);
    margin: 0 auto;
  }

  .three-by {
    display: grid;
    grid-template-columns: repeat(4, 20vw);
    grid-template-rows: repeat(3, 1fr);
    row-gap: 2rem;
  }

  p {
    padding: 0;
    margin: 0;
    text-align: right;
  }

  .frame {
    justify-content: center;
    width: calc(clamp(20rem, 100vw, 100rem) - 2rem);
  }

  h3,
  h2,
  h1 {
    text-align: center;
  }

  h1 {
    font-size: clamp(8px, 2cqw, 24px);
  }

  h2 {
    font-size: clamp(8px, 1.8cqw, 20px);
  }

  .border {
    border: 1px solid rgba(200, 200, 200, 0.5);
  }

  main {
    margin-bottom: 5rem;
  }

  .fit {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  * {
    font-size: clamp(8px, 1cqw, 16px);
  }
</style>
