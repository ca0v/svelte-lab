<script lang="ts">
  import { onDestroy, onMount, beforeUpdate } from "svelte"
  import CollageView from "./components/CollageView.svelte"
  import DateRange from "./components/DateRange.svelte"
  import { stories } from "./store/stories"
  import { collageTemplates as transforms } from "./store/transforms"

  import Commands from "./components/Commands.svelte"
  import Notes from "./components/Notes.svelte"
  import SvgPaths from "./components/SvgPaths.svelte"
  import { fetchPhotoList, saveCollage } from "./data/collageServices"
  import { addDays, getLocalStorage, setLocalStorage } from "./lib/globals"
  import type { CollageData, Photo } from "./data/Api"
  import Toaster from "./components/Toaster.svelte"
  import { reportExceptions, toast } from "./store/toasts"
  import { addCommand, removeCommand, shortcut } from "./store/commands"
  import { signin, signout } from "./lib/googleApi"
  import { refreshBaseurl } from "./store/photos"
  import { writable } from "svelte/store"

  let photos: Array<Photo> = []
  let photosToShow: Array<Photo> = []

  let collageId = writable<string>("")
  let collageView: CollageView

  let activeCollage: CollageData | null = null

  let states = {
    saving: false,
    isSignedIn: false,
    editor: {
      editmode: false,
    },
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

  async function handleAuthClick() {
    await signin()
    states.isSignedIn = true

    photos = await getPhotosFor2022()
    photos.sort((a, b) => a.created.localeCompare(b.created))
    console.log({ photos })
    states.datefilter.from =
      states.datefilter.from || photos[0]?.created.split("T")[0] || ""
  }

  function handleSignoutClick() {
    signout()
    states.isSignedIn = false
  }

  // assign images to each image element
  function autoAssignImages(photos: Photo[]) {
    let j = 0
    activeCollage.data.some((transform) => {
      if (j >= photos.length) return true
      transform.id = transform.id || photos[j++].id
    })
    activeCollage = activeCollage
  }

  function clearAllImages() {
    activeCollage.data.forEach((t) => {
      t.id = ""
      t.baseurl = ""
    })
    activeCollage = activeCollage
  }

  function asZulu(yyyymmdd: string) {
    const [year, month, day] = yyyymmdd.split("-").map((v) => parseInt(v))
    const result = new Date(year, month - 1, day).toISOString()
    return result
  }

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

  function createUniqueId(): string {
    return Math.random()
      .toString(36)
      .substring(2, 16 + 2)
  }

  states.datefilter.from &&
    localStorage.setItem("date_filter", states.datefilter.from)

  async function refreshStory(story: CollageData) {
    if (story?.data) {
      await refreshBaseurl(story.data)
    }
  }

  collageId.subscribe(async (v) => {
    localStorage.setItem("collage_name", $collageId)

    if (states.isSignedIn && $collageId) {
      activeCollage = $stories.find((h) => h.id === $collageId)
    }
  })

  $: states.datefilter.to =
    states.datefilter.to || addDays(states.datefilter.from, 1)

  $: {
    if (states.isSignedIn && states.datefilter.from && states.datefilter.to) {
      const from = asZulu(states.datefilter.from)
      const to = asZulu(states.datefilter.to)
      const toShow = photos.filter((p) => from <= p.created && p.created < to)

      refreshBaseurl(toShow).then(() => {
        photosToShow = toShow
      })
    }
  }

  onMount(async () => {
    states.datefilter.from = localStorage.getItem("date_filter") || ""
    $collageId = localStorage.getItem("collage_name") || ""

    addCommand({
      name: "goto-photowheel",
      title: "Focus the PhotoWheel",
      trigger: {
        key: "p",
        isShift: true,
      },
      execute: () => {
        collageView.focusPhotoWheel()
      },
    })

    addCommand({
      name: "Preview",
      event: "preview",
      title: "Preview collage",
      trigger: {
        key: "p",
        isCtrl: true,
      },
      execute: () => (states.preview.visible = !states.preview.visible),
    })

    addCommand({
      name: "Toggle Edit Mode",
      event: "toggle_edit_mode",
      title: "Toggle Edit Mode",
      trigger: {
        key: "/",
      },
      execute: () => {
        states.editor.editmode = !states.editor.editmode
      },
    })

    Object.keys($transforms).forEach((name, i) => {
      addCommand({
        name,
        event: name,
        title: `Use the "${name}" transform`,
        trigger: {
          key: (i >= 40 ? "" : (i % 10) + 1) + "",
          preamble: "t",
          isCtrl: i >= 10 && i < 20,
          isAlt: i >= 20 && i < 30,
          isShift: i >= 30 && i < 40,
        },
        execute: () => {
          applyTransform(name)
          toast(`Transform applied: ${name}`)
        },
      })
    })
  })

  onDestroy(() => {
    removeCommand("Preview")
    removeCommand("Toggle Edit Mode")
    removeCommand("goto-photowheel")

    Object.keys($transforms).forEach(removeCommand)

    document
      .querySelectorAll("[data-shortcut]")
      .forEach((element: HTMLElement) => {
        removeCommand(`goto-${element.title}`)
      })
  })

  async function getPhotosFor2022() {
    const startDate =
      (await getLocalStorage("fetchPhotoList:end-date")) || "2021-12-31"
    const endDate = "2022-12-31"

    const cachedPhotos: Record<string, Photo> =
      (await getLocalStorage("fetchPhotoList:photos")) || {}

    const responseIterator = fetchPhotoList(startDate, endDate)

    while (true) {
      const response = await responseIterator.next()
      if (response.done) break

      const photos = response.value
      if (!Array.isArray(photos)) break
      if (!photos.length) break

      photos.forEach((photo) => {
        cachedPhotos[photo.id] = photo
      })
      setLocalStorage("fetchPhotoList:photos", cachedPhotos)

      photos.sort((a, b) => a.created.localeCompare(b.created))

      setLocalStorage(
        "fetchPhotoList:end-date",
        photos[photos.length - 1].created.split("T")[0]
      )
    }

    const result = Object.values(cachedPhotos).sort((a, b) =>
      a.created.localeCompare(b.created)
    )

    return result
  }
</script>

<main>
  <SvgPaths />
  <Commands
    watch={document}
    on:start_new_story={() => {
      const newStory = {
        id: createUniqueId(),
        title: states.datefilter.from,
        data: [],
      }
      stories.update((s) => [newStory, ...s])
      $collageId = newStory.id
      states.titleEditor.edit = true
    }}
    on:save_story={async () => {
      states.saving = true
      try {
        console.log("save", activeCollage)
        setLocalStorage(`${activeCollage.id}`, activeCollage)
        await saveCollage({ ...activeCollage })
        toast("Saved")
      } catch (ex) {
        reportError(ex)
        toast(`Error: ${ex}`)
      } finally {
        states.saving = false
      }
    }}
    on:auto_assign_photos={() => autoAssignImages(photosToShow)}
    on:clear_all_photos={() => clearAllImages()}
  />

  <h1>Just.Be.Collage</h1>
  <h2>
    Collage Builder for <google>Google Photos</google>
  </h2>
  <section class="toolbar">
    <input
      type="button"
      disabled={!states.isSignedIn}
      class="google_photos_button"
      value="Sign out from Google Photos"
      on:click={handleSignoutClick}
    />
    <input
      type="button"
      disabled={states.isSignedIn}
      class="google_photos_button"
      value="Connect to Google Photos"
      on:click={reportExceptions(handleAuthClick)}
    />
  </section>

  {#if states.isSignedIn}
    <div class="frame">
      <div class="two-column">
        <p>S<u>t</u>ories</p>
        <select
          bind:value={$collageId}
          use:shortcut={"Shift>T"}
          title="Select an existing story"
        >
          {#each $stories.sort( (a, b) => a.title.localeCompare(b.title) ) as collage}
            <option value={collage.id}>{collage.title}</option>
          {/each}
        </select>
        {#if activeCollage}
          <p>Title</p>
          <input
            type="text"
            bind:value={activeCollage.title}
            title="Edit the title for this story"
            disabled={!activeCollage}
          />
          <p><u>N</u>otes</p>
          <Notes shortcut="Shift>N" bind:note={activeCollage.note} />
        {/if}
      </div>
      <div class="spacer" />
      {#if activeCollage && states.isSignedIn}
        {#await refreshStory(activeCollage)}
          <p>Loading...</p>
        {:then}
          <CollageView
            bind:this={collageView}
            transforms={activeCollage}
            bind:editmode={states.editor.editmode}
            on:save={async () => {
              throw "not supported, remove"
            }}
            sources={photosToShow.map((p) => ({ id: p.id, url: p.baseurl }))}
          >
            <div class="spacer" />
            <div class="toolbar">
              <DateRange
                bind:date_filter_from={states.datefilter.from}
                bind:date_filter_to={states.datefilter.to}
              />
              <p>{photosToShow.length} of {photos.length} photo(s)</p>
            </div>
          </CollageView>
        {/await}
      {/if}
    </div>
  {/if}

  {#if states.preview.visible}
    <div class="preview-area">
      <h2>Preview</h2>
      <div class="frame three-by">
        {#each $stories.filter((c) => c.data?.length).reverse() as collage}
          <div class="border">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <h3 class="fit">
              <button
                on:click={() => {
                  $collageId = collage.id
                  states.preview.visible = false
                }}
              >
                {collage.title}
              </button>
            </h3>
            {#await refreshStory(collage)}
              <p>Loading...</p>
            {:then}
              <CollageView readonly={true} transforms={collage} />
            {/await}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</main>

<Toaster />

<style>
  main {
    margin: 0;
    margin-left: 5rem;
    width: calc(100vw - 10rem);
  }

  p {
    padding: 0;
    margin: 0;
    text-align: right;
  }

  .frame {
    justify-content: center;
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

  .two-column {
    display: grid;
    grid-template-columns: 5rem auto;
    grid-gap: 1rem;
  }

  .three-by {
    display: grid;
    grid-template-columns: repeat(4, 20vw);
    grid-template-rows: repeat(3, 1fr);
    row-gap: 2rem;
  }

  .border {
    padding: 0.25rem;
    border-radius: 0.25rem;
    background-color: #333;
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

  .toolbar {
    display: grid;
    grid-gap: 0.25rem;
    padding: 0.25rem;
    justify-content: center;
  }

  .toolbar > input {
    width: fit-content;
  }

  .spacer {
    height: 1rem;
    width: 1rem;
  }

  .preview-area {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    background-color: black;
  }

  @media (prefers-color-scheme: dark) {
    .google_photos_button {
      background-color: var(--color-google-gray);
      color: #ccc;
    }
  }

  @media (prefers-color-scheme: light) {
    .google_photos_button {
      background-color: var(--color-google-white);
      color: var(--color-google-gray);
    }
  }

  google {
    font-size: smaller;
  }

  .google_photos_button {
    --color-google-white: #ffffff;
    --color-google-gray: #3c4043;
    background-image: url(/google_photos_icon.png);
    background-repeat: no-repeat;
    background-position: 8px 8px;
    background-size: 24px 24px;
    padding-left: calc(8px + 24px + 16px);
    padding-right: 16px;
    height: 40px;
    border-radius: 4px;
  }

  .google_photos_button:disabled {
    display: none;
  }
</style>
