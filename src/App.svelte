<script lang="ts">
  import { onMount } from "svelte"
  import CollageView from "./components/CollageView.svelte"
  import DateRange from "./components/DateRange.svelte"
  import { stories } from "./store/stories"
  import { collageTemplates as transforms } from "./store/transforms"

  import Notes from "./components/Notes.svelte"
  import SvgPaths from "./components/SvgPaths.svelte"
  import {
    asPhotoServiceUrl,
    fetchPhotoList,
    saveCollage,
  } from "./data/collageServices"
  import { extractId, setLocalStorage } from "./lib/globals"
  import type { Photo } from "./data/Api"
  import Toaster from "./components/Toaster.svelte"
  import { toast } from "./store/toasts"

  let photos: Array<Photo> = []

  let collageId = ""

  let states = {
    saving: false,
    titleEditor: {
      edit: false,
    },
    audioRecorder: {
      visible: false,
    },
    preview: {
      visible: false,
    },
    datefilter: {
      from: "",
      to: "",
    },
  }

  // assign images to each image element
  function autoAssignImages(urls: string[]) {
    let j = 0
    activeCollage.data.some((transform) => {
      if (j >= urls.length) return true
      transform.id = transform.id || extractId(urls[j++])
    })
    activeCollage = activeCollage
  }

  function clearAllImages() {
    activeCollage.data.forEach((t) => (t.id = ""))
    activeCollage = activeCollage
  }

  $: {
    states.datefilter.from &&
      localStorage.setItem("date_filter", states.datefilter.from)
  }

  $: activeCollage = collageId && $stories.find((h) => h.id === collageId)

  $: {
    collageId && localStorage.setItem("collage_name", collageId)
  }

  $: photosToShow = photos.filter(
    (p) =>
      !states.datefilter.from ||
      (states.datefilter.from <= p.created && p.created <= states.datefilter.to)
  )

  function applyTransform(activeTransformId: string) {
    const transform = $transforms[activeTransformId]
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
    states.datefilter.from = localStorage.getItem("date_filter") || ""
    collageId = localStorage.getItem("collage_name") || ""
    photos = await fetchPhotoList()
    photos.sort((a, b) => a.created.localeCompare(b.created))
    states.datefilter.from =
      states.datefilter.from || photos[0]?.created.split("T")[0] || ""
  })

  function createUniqueId(): string {
    return Math.random()
      .toString(36)
      .substring(2, 16 + 2)
  }
</script>

<main>
  <SvgPaths />
  <h1>Photo Playground</h1>

  <div class="frame">
    <h2>For Editing</h2>
    <div class="two-column">
      <p>S<u>t</u>ories</p>
      <div class="collage-name-component">
        <select
          bind:value={collageId}
          data-shortcut="Shift>t"
          title="Select an existing story"
        >
          {#each $stories as collage}
            <option value={collage.id}>{collage.title}</option>
          {/each}
        </select>
        {#if activeCollage}
          <input type="text" bind:value={activeCollage.title} />
        {:else}
          <input type="text" disabled />
        {/if}
        <button
          class="add"
          data-shortcut="Shift>c"
          title="Create a new collage"
          on:click={() => {
            const newStory = {
              id: createUniqueId(),
              title: states.datefilter.from,
              data: [],
            }
            stories.update((s) => [newStory, ...s])
            collageId = newStory.id
            states.titleEditor.edit = true
          }}><u>C</u>reate</button
        >
        <button
          disabled={states.saving}
          class="add"
          data-shortcut="Shift>s"
          title="Save the collage"
          on:click={async () => {
            states.saving = true
            try {
              console.log("save", activeCollage)
              toast("Saving")
              setLocalStorage(`${activeCollage.id}`, activeCollage)
              await saveCollage({ ...activeCollage })
              toast("Saved")
            } catch (ex) {
              reportError(ex)
              toast(`Error: ${ex}`)
            } finally {
              states.saving = false
            }
          }}><u>S</u>ave</button
        >
      </div>
      {#if activeCollage}
        <p><u>N</u>otes</p>
        <Notes shortcut="Shift>n" bind:note={activeCollage.note} />
      {/if}
    </div>
    <CollageView
      id={collageId}
      transforms={activeCollage}
      duration={0.01}
      on:save={async () => {
        throw "not supported, remove"
      }}
      sources={photosToShow.map(asPhotoServiceUrl)}
    >
      <div class="toolbar">
        {#each Object.entries($transforms) as [name]}
          <input
            type="button"
            value={name}
            on:click={() => applyTransform(name)}
          />
        {/each}
        <button
          on:click={() => {
            autoAssignImages(photosToShow.map(asPhotoServiceUrl))
          }}>Auto Assign</button
        >
        <button
          on:click={() => {
            clearAllImages()
          }}>Clear All</button
        >
        <DateRange
          bind:date_filter_from={states.datefilter.from}
          bind:date_filter_to={states.datefilter.to}
        />
      </div>
    </CollageView>
    <p>{photosToShow.length} photo(s)</p>
  </div>

  <button on:click={() => (states.preview.visible = !states.preview.visible)}
    >Preview</button
  >
  {#if states.preview.visible}
    <h2>Preview</h2>
    <div class="frame three-by">
      {#each $stories.filter((c) => c.data?.length).reverse() as collage, i}
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

<Toaster />

<style>
  .two-column {
    display: grid;
    grid-template-columns: 1fr 7fr;
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

  .collage-name-component {
    display: grid;
    grid-template-columns: 1fr 1fr 5rem 5rem;
    grid-gap: 1rem;
  }

  .toolbar {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 1rem;
  }
</style>
