<script lang="ts">
  import { onMount } from "svelte"
  import CollageView from "./components/CollageView.svelte"
  import DateRange from "./components/DateRange.svelte"
  import {
    transforms,
    collages,
    type Photo,
    type CollageState,
  } from "./data/collageTemplates"

  import AudioRecorder from "./components/AudioRecorder.svelte"
  import Notes from "./components/Notes.svelte"
  import SvgPaths from "./components/SvgPaths.svelte"
  import { asPhotoServiceUrl, fetchPhotoList } from "./data/collageServices"

  let photos: Array<Photo> = []

  let collageName = ""
  let transformName = ""
  let date_filter_from = ""
  let date_filter_to = ""
  let activeCollage: CollageState | undefined

  $: {
    date_filter_from && localStorage.setItem("date_filter", date_filter_from)
    collageName && localStorage.setItem("collage_name", collageName)
    activeCollage =
      collageName && collages && collages.find((h) => h.id === collageName)

    const transform = transforms[transformName]
    if (transform && activeCollage) {
      // capture existing images
      const ids = activeCollage?.data.map((d) => d.id).filter((v) => !!v)
      // replace transform
      activeCollage.data = transform.map((t, i) => ({
        id: ids[i] || "",
        target: "i" + t.i,
        transform: t.style,
        clipPath: t.clipPath,
        height: t.bbox?.height || 100,
        width: t.bbox?.width || 100,
        x: t.bbox?.x || -50,
        y: t.bbox?.y || -50,
      }))
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
  <SvgPaths />

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
    <CollageView
      id={collageName}
      transforms={activeCollage}
      duration={0.01}
      sources={photos
        .filter(
          (p) =>
            !date_filter_from ||
            (date_filter_from <= p.created && p.created <= date_filter_to)
        )
        .map(asPhotoServiceUrl)}
    >
      <DateRange bind:date_filter_from bind:date_filter_to />
    </CollageView>
  </div>

  {#if true}
    <h2>Preview</h2>
    <div class="frame three-by">
      {#each collages.filter((c) => c.data.length) as collage, i}
        <div class="border">
          <h3 class="fit">{collage.title}</h3>
          <CollageView
            id={`view_${collage.id}`}
            duration={[0.2, 0.3, 0.4][i] || 1}
            readonly={true}
            transforms={collage}
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
