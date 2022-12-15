<script lang="ts">
  import { onMount } from "svelte"
  import CollageView from "./components/CollageView.svelte"
  import DateRange from "./components/DateRange.svelte"
  import { transforms, collages as stories } from "./data/collageTemplates"

  import AudioRecorder from "./components/AudioRecorder.svelte"
  import Notes from "./components/Notes.svelte"
  import SvgPaths from "./components/SvgPaths.svelte"
  import {
    asPhotoServiceUrl,
    deleteRecording,
    fetchPhotoList,
    getAllAudioRecordings,
    saveCollage,
    saveRecording,
    updateRecording,
  } from "./data/collageServices"
  import { setLocalStorage } from "./lib/globals"
  import type { CollageData, Photo, Recording } from "./data/Api"

  let recordings: Array<Recording> = []
  let photos: Array<Photo> = []

  let collages = [...stories]
  let collageName = ""
  let transformName = ""
  let date_filter_from = ""
  let date_filter_to = ""
  let activeCollage: CollageData | undefined
  let errors: Array<string> = []

  let states = {
    titleEditor: {
      edit: false,
    },
    audioRecorder: {
      visible: false,
    },
  }

  $: {
    date_filter_from && localStorage.setItem("date_filter", date_filter_from)
  }

  $: {
    collageName && localStorage.setItem("collage_name", collageName)
    activeCollage =
      collageName && collages && collages.find((h) => h.id === collageName)
  }

  $: {
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

    recordings = await getAllAudioRecordings()

    document.addEventListener(
      "console.error",
      (e: Event & { detail: Array<string> }) => {
        const message = e.detail.join(",")
        errors = [message, ...errors]
      }
    )

    window.addEventListener("error", (e: ErrorEvent & { detail: any }) => {
      try {
        if (e.detail?.message) {
          errors = [e.detail.message, ...errors]
        } else {
          console.log(e)
        }
      } catch (e) {
        console.log(e)
      }
    })
  })

  function createUniqueId(): string {
    return Math.random()
      .toString(36)
      .substring(2, 16 + 2)
  }

  async function trackTitleChangeHandler(e: CustomEvent<any>) {
    const recording = e.detail
    console.log("title change", recording)
    updateRecording(recording.id, { title: recording.title })
  }
</script>

<main>
  <SvgPaths />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <errors on:click={() => (errors.length = 0)}>
    {#each errors as error}
      <div class="error">{error}</div>
    {/each}
  </errors>

  <h1>Photo Playground</h1>

  <div class="frame">
    <h2>For Editing</h2>
    <div class="two-column">
      <p><u>C</u>ollage Name</p>
      <div class="collage-name-component">
        {#if activeCollage && states.titleEditor.edit}
          <input type="text" bind:value={activeCollage.title} />
        {:else}
          <select bind:value={collageName} data-shortcut="C">
            {#each collages as collage}
              <option value={collage.id}>{collage.title} {collage.id}</option>
            {/each}
          </select>
        {/if}
        <button
          class="add"
          on:click={() => {
            collages = [
              {
                id: createUniqueId(),
                title: "New Collage",
                data: [],
              },
              ...collages,
            ]
            collageName = collages[0].id
            states.titleEditor.edit = true
          }}>Create</button
        >

        {#if states.titleEditor.edit}
          <button
            on:click={() => {
              states.titleEditor.edit = !states.titleEditor.edit
              saveCollage(activeCollage)
            }}>Save</button
          >
        {:else}
          <button
            on:click={() =>
              (states.titleEditor.edit = !states.titleEditor.edit)}>Edit</button
          >
        {/if}
      </div>
      <p><u>T</u>ransform</p>
      <select data-shortcut="T" bind:value={transformName}>
        {#each Object.entries(transforms) as [name]}<option value={name}
            >{name}</option
          >
        {/each}
      </select>
      {#if states.audioRecorder.visible}
        <p>Audio Recordings</p>
        <AudioRecorder
          {recordings}
          on:track-title-change={trackTitleChangeHandler}
          on:delete={async (e) => {
            const recording = e.detail
            await deleteRecording(recording)
            recordings = recordings.filter((r) => r.id !== recording.id)
          }}
          on:save={async (e) => {
            const recording = e.detail
            await saveRecording(recording)
            recordings = [recording, ...recordings]
          }}
        />
      {:else}
        <p />
        <button
          on:click={() =>
            (states.audioRecorder.visible = !states.audioRecorder.visible)}
          >Audio</button
        >
      {/if}
      {#if activeCollage}
        <p>Notes</p>
        <Notes bind:note={activeCollage.note} />
      {/if}
    </div>
    <CollageView
      id={collageName}
      transforms={activeCollage}
      duration={0.01}
      on:save={async () => {
        console.log("save", activeCollage)
        setLocalStorage(`${activeCollage.id}`, activeCollage)
        await saveCollage({ ...activeCollage })
      }}
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

  <h2>Preview</h2>
  <div class="frame three-by">
    {#each stories.filter((c) => c.data?.length) as collage, i}
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
</main>

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

  errors {
    display: grid;
    grid-template-columns: 1fr;
    cursor: pointer;
    color: red;
  }

  .collage-name-component {
    display: grid;
    grid-template-columns: 1fr 5rem 5rem;
    grid-gap: 1rem;
  }

  .collage-name-component > input {
    color: green;
  }
</style>
