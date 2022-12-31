<script lang="ts" context="module">
  async function copyToClipboard() {
    await canvasToClipboard(
      document.querySelector("#canvas") as HTMLCanvasElement
    )
  }

  function asZulu(yyyymmdd: string | Date) {
    if (typeof yyyymmdd === "string") {
      const [year, month, day] = yyyymmdd.split("-").map((v) => parseInt(v))
      const result = new Date(year, month - 1, day).toISOString()
      return result
    } else {
      return yyyymmdd.toISOString().split("T")[0]
    }
  }

  function createUniqueId(): string {
    return Math.random()
      .toString(36)
      .substring(2, 16 + 2)
  }
</script>

<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { writable } from "svelte/store"
  import CollageView from "./components/CollageView.svelte"
  import DateRange from "./components/DateRange.svelte"
  import Logo from "./components/Logo.svelte"
  import Toolbar from "./components/Toolbar.svelte"
  import { loadAllStories } from "./store/stories"
  import { collageTemplates as transforms } from "./store/transforms"
  import { commander, contexts, state as commandState } from "./store/commands"

  import Commands from "./components/Commands.svelte"
  import Notes from "./components/Notes.svelte"
  import SvgPaths from "./components/SvgPaths.svelte"
  import { fetchPhotoList, saveCollage } from "./data/collageServices"
  import { addDays, getLocalStorage, log, setLocalStorage } from "./lib/globals"
  import type { ClipPaths, CollageData, Photo } from "./d.ts/index"
  import Toaster from "./components/Toaster.svelte"
  import { toast, toasts, toss } from "./store/toasts"
  import { shortcut } from "./store/commands"
  import { refreshBaseurl } from "./store/photos"
  import GoogleSignin from "./components/GoogleSignin.svelte"
  import { getClipPathPoints } from "./lib/paths"
  import { canvasToClipboard, svgToCanvas } from "./store/svg"

  let photos: Array<Photo> = []
  let photosToShow: Array<Photo> = []

  const collageId = writable("")
  let collageView: CollageView

  let activeCollage: CollageData | null = {}
  let activeCollageNote = ""

  let stories: Array<CollageData> = []

  let states = {
    app: {
      showColorWheel: false,
      showCanvas: false,
      colorWheelAngle: 0,
    },
    menu: {
      isOpen: false,
    },
    editor: {
      editmode: true,
      width: 100,
      widthUnits: "cqw",
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

  const hackState = {
    isSignedIn: false,
    app: {
      showColorWheel: false,
      colorWheelAngle: 0,
      isSaving: false,
      isLoading: false,
    },
    editor: {
      isTouched: false,
      data: "",
    },
    datefilter: {
      from: "",
    },
  }

  function makeClean() {
    hackState.editor.isTouched = false
    hackState.editor.data = JSON.stringify(activeCollage)
  }

  function isDirty() {
    if (!hackState.editor.data) return false
    if (!activeCollage?.data) return false
    if (hackState.editor.isTouched) return true
    buildDocument()
    hackState.editor.isTouched =
      hackState.editor.data !== JSON.stringify(activeCollage)
    return hackState.editor.isTouched
  }

  async function handleAuthClick() {
    // get the google auth2 object
    stories = await loadAllStories()
    log("stories loaded", JSON.stringify(stories))
    states.datefilter.from = states.datefilter.from || asZulu(new Date())
    hackState.isSignedIn = true

    refreshPhotoWheel()

    collageId.subscribe(async (v) => {
      if (!v) return
      if (!hackState.isSignedIn) return
      if (isDirty()) {
        if (confirm("Save changes?")) await saveDocument()
      }
      setLocalStorage("collage_name", v)
      const storyToLoad = stories.find((h) => h.id === v + "")
      log("stories", JSON.stringify(stories))
      if (!storyToLoad) {
        throw toss(`Story not found: ${v}`)
      }
      toast("Acquiring story data...")
      await refreshStory(storyToLoad)
      activeCollage = storyToLoad
      makeClean()
      // clear the undo/redo stack
      commander.clearChangeHistory()
      activeCollageNote = storyToLoad.note || ""
    })
  }

  // assign images to each image element
  async function autoAssignImages(photos: Photo[]) {
    if (!activeCollage?.data) throw toss("No active collage")
    let j = 0
    activeCollage.data.some((transform) => {
      if (j >= photos.length) return true
      transform.id = transform.id || photos[j++].id
    })
    await refreshStory(activeCollage)
    activeCollage = activeCollage
  }

  function clearAllImages() {
    if (!activeCollage?.data) throw new Error("No active collage")
    activeCollage.data.forEach((t) => {
      t.id = ""
      t.baseurl = ""
    })
    activeCollage = activeCollage
  }

  function applyTransform(activeTransformId: string) {
    if (!activeCollage?.data) throw new Error("No active collage")
    const transform = $transforms[activeTransformId]
    if (!transform) throw new Error("No transform found")
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

  async function refreshStory(story: CollageData) {
    if (story?.data) {
      await refreshBaseurl(story.data)
    }
  }

  async function refreshPhotoWheel() {
    if (hackState.isSignedIn && states.datefilter.from) {
      const from = asZulu(states.datefilter.from)
      states.datefilter.to = addDays(states.datefilter.from, 1)
      const to = asZulu(states.datefilter.to)
      hackState.app.isLoading = true
      photos = await getPhotosForOneDay(from)
      hackState.app.isLoading = false
      photosToShow = photos
        .filter((p) => {
          const result = from <= p.created! && p.created! < to
          log({ result, from, created: p.created, to, baseurl: p.baseurl })
          return result
        })
        .sort((a, b) => a.created!.localeCompare(b.created!))
    }
  }

  async function saveDocument() {
    setLocalStorage("app.state", states)
    if (!activeCollage) throw new Error("No active collage")
    hackState.app.isSaving = true
    try {
      setLocalStorage(`${activeCollage.id}`, activeCollage)

      // every distinct clippath used by the collage must be saved
      if (activeCollage.data) {
        const clipPathIds = [
          ...new Set(
            activeCollage.data.map((t) => t.clipPath).filter((v) => !!v)
          ),
        ] as Array<string>

        const clipPaths = clipPathIds.reduce((result, id) => {
          const d = getClipPathPoints(`clip_${id}`)
          if (d) {
            result[id] = d
          }
          return result
        }, <ClipPaths>{})

        activeCollage.clipPaths = clipPaths
      }

      buildDocument()
      await saveCollage({ ...activeCollage })
      makeClean()
      toast("Saved")
    } catch (ex) {
      reportError(ex)
      toast(`Error: ${ex}`)
    } finally {
      hackState.app.isSaving = false
    }
  }

  $: {
    // how to get this to run ony when the datefilter.from changes?
    if (states.datefilter.from !== hackState.datefilter.from) {
      hackState.datefilter.from = states.datefilter.from
      if (hackState.isSignedIn) {
        toast(`Refreshing Photo Wheel`)
        refreshPhotoWheel()
      }
    }

    if (states.app.colorWheelAngle != hackState.app.colorWheelAngle) {
      hackState.app.colorWheelAngle = states.app.colorWheelAngle
      toast(`Color wheel angle: ${states.app.colorWheelAngle}deg`)
      document.documentElement.style.setProperty(
        "--theme-hue",
        `${states.app.colorWheelAngle}`
      )
    }
  }

  onMount(async () => {
    states = await getLocalStorage("app.state", states)
    $collageId = (await getLocalStorage("collage_name", "")) + ""
    log("collageId", { $collageId })

    contexts.file
      .addCommand({
        event: "save_story",
        name: "Save",
        title: "Save story",
        trigger: {
          key: "s",
        },
        disabled: () => !activeCollage?.data,
        execute: async () => {
          await saveDocument()
        },
      })
      .addCommand({
        event: "start_new_story",
        name: "Create Story",
        trigger: {
          key: "n",
        },
        execute: () => {
          const newStory = {
            id: createUniqueId(),
            title: states.datefilter.from,
            data: [],
          }
          stories.push(newStory)
          $collageId = newStory.id
          states.titleEditor.edit = true
          states.editor.editmode = true
          // "toggle-command-menu"
          states.menu.isOpen = true
          toast("New Story Created")
        },
      })
      .addCommand({
        name: "Toggle Edit Mode",
        event: "toggle_edit_mode",
        trigger: {
          key: "e",
        },
        execute: () => {
          states.editor.editmode = !states.editor.editmode
        },
      })

    contexts.workarea
      .addCommand({
        event: "auto_assign_photos",
        name: "Auto Assign Photos",
        trigger: {
          key: "a",
        },
        execute: async () => autoAssignImages(photosToShow),
      })
      .addCommand({
        event: "clear_all_photos",
        name: "Clear All Photos",
        trigger: {
          key: "c",
        },
        execute: () => clearAllImages(),
      })
      .addCommand({
        event: "toggle-color-wheel",
        name: "Toggle Color Wheel",
        trigger: {
          key: " ",
          isShift: true,
          isAlt: true,
          isCtrl: true,
        },
        execute: () => {
          states.app.showColorWheel = !states.app.showColorWheel
          return true
        },
      })
      .addCommand({
        name: "goto-photowheel",
        title: "Focus the PhotoWheel",
        trigger: {
          key: "p",
        },
        execute: () => {
          collageView.focusPhotoWheel()
        },
      })

    contexts.primary
      .addCommand({
        name: "Copy To Canvas",
        trigger: {
          key: "c",
          isCtrl: true,
        },
        execute: async () => {
          states.app.showCanvas = true
          const svg = document.querySelector(".workarea svg") as SVGSVGElement
          const canvas = document.querySelector("#canvas") as HTMLCanvasElement
          await svgToCanvas(svg, canvas)
        },
      })
      .addCommand({
        event: "zoom-in-workarea",
        name: "Zoom Workarea In",
        trigger: {
          key: "=",
          isCtrl: true,
          isAlt: true,
        },
        disabled: () => !activeCollage?.data,
        execute: () => {
          states.editor.width = Math.min(states.editor.width + 1, 200)
          return true
        },
      })
      .addCommand({
        event: "zoom-out-workarea",
        name: "Zoom Workarea Out",
        trigger: {
          key: "-",
          isCtrl: true,
          isAlt: true,
        },
        disabled: () => !activeCollage?.data,
        execute: () => {
          states.editor.width = Math.max(states.editor.width - 1, 25)
          return true
        },
      })
      .addCommand({
        name: "Preview",
        event: "preview",
        title: "Preview collage",
        trigger: {
          key: "p",
          isAlt: true,
        },
        execute: () => (states.preview.visible = !states.preview.visible),
      })
    commander.listen()

    const LAYOUTSHORTCUTKEYS = "abcdefghijklmnopqrstuvwxyz".split("")
    Object.keys($transforms).forEach((name, i) => {
      commander
        .context({
          name: "Use Layout",
          trigger: { key: "X", isShift: true },
        })
        .addCommand({
          name,
          event: name,
          title: `Use the "${name}" layout`,
          trigger: {
            key: LAYOUTSHORTCUTKEYS[i % LAYOUTSHORTCUTKEYS.length],
            isCtrl:
              i > LAYOUTSHORTCUTKEYS.length &&
              i < 3 * LAYOUTSHORTCUTKEYS.length,
            isAlt: i > 2 * LAYOUTSHORTCUTKEYS.length,
          },
          execute: () => {
            applyTransform(name)
            toast(`Transform applied: ${name}`)
          },
        })
    })
  })

  onDestroy(() => {
    commander.unlisten()
    setLocalStorage("app.state", states)
  })

  function buildDocument() {
    if (!activeCollage) throw `No active collage`
    activeCollage.note = activeCollageNote || ""
  }

  async function getPhotosForOneDay(yyyy_mm_dd: string) {
    const startDate = addDays(yyyy_mm_dd, -1)
    const endDate = addDays(yyyy_mm_dd, 1)
    log(`fetching photos from ${startDate} to ${endDate}`)
    const responseIterator = fetchPhotoList(startDate, endDate)

    const result: Array<Photo> = []
    while (true) {
      const response = await responseIterator.next()
      if (response.done) break

      const photos = response.value
      if (!Array.isArray(photos)) break
      if (!photos.length) break
      result.push(...photos)
    }

    return result.sort((a, b) => a.created!.localeCompare(b.created!))
  }
</script>

<svelte:window
  on:error={(event) => {
    try {
      alert(event)
      toast(JSON.stringify(event))
    } catch (e) {
      log(event)
    }
  }}
  on:beforeunload={(event) => {
    log("beforeunload")
    if (isDirty()) {
      event.preventDefault()
      return (event.returnValue =
        "You have unsaved changes.  Are you sure you want to exit?")
    }
  }}
/>

<div class="canvas-viewer" class:off-screen={!states.app.showCanvas}>
  <canvas id="canvas" width="1024" height="1024" />
  <button
    on:click={async () => {
      await copyToClipboard()
      states.app.showCanvas = false
    }}>Copy To Clipboard</button
  >
  <img
    class="off-screen"
    id="image"
    crossorigin="anonymous"
    alt="svg-to-canvas helper"
  />
</div>

<Commands bind:isOpen={states.menu.isOpen}>
  <GoogleSignin autoSignIn={false} />
</Commands>

<Toolbar>
  <h1>just.be.collage</h1>
</Toolbar>

<main>
  {#if hackState.isSignedIn}
    <SvgPaths />
  {:else}
    <Logo>
      <GoogleSignin autoSignIn={true} on:signedin={handleAuthClick} /></Logo
    >
  {/if}

  {#if hackState.isSignedIn}
    <div class="frame" hidden={states.preview.visible}>
      <div class="work-area">
        <div class="two-column">
          <p>S<u>t</u>ories</p>
          {#if !stories.length}
            <button on:click={() => commander.play("start_new_story")} />
          {:else}
            <select
              bind:value={$collageId}
              use:shortcut={{ key: "t", isAlt: true }}
              title="Select an existing story"
            >
              {#each stories as collage}
                <option value={collage.id}>{collage.title}</option>
              {/each}
            </select>
          {/if}
          {#if activeCollage}
            <p>Title</p>
            <input
              type="text"
              bind:value={activeCollage.title}
              title="Edit the title for this story"
              disabled={!activeCollage}
            />
            <p><u>N</u>otes</p>
            <Notes
              shortcut={{ key: "n", isAlt: true, editmode: true }}
              bind:note={activeCollageNote}
            />
          {/if}
        </div>
        {#if activeCollage}
          <CollageView
            width={states.editor.width + states.editor.widthUnits}
            bind:this={collageView}
            transforms={activeCollage}
            bind:editmode={states.editor.editmode}
            sources={photosToShow.map((p) => ({
              id: p.id || "",
              url: p.baseurl || "",
            }))}
          >
            <div
              class="status"
              class:loading={hackState.app.isLoading}
              class:saving={hackState.app.isSaving}
            >
              {$toasts[0]?.message || $commandState.activeContext + " mode"}
              {hackState.app.isLoading ? "loading..." : ""}
              {hackState.app.isSaving ? "saving..." : ""}
            </div>
            <div class="toolbar">
              <DateRange
                bind:date_filter_from={states.datefilter.from}
                bind:date_filter_to={states.datefilter.to}
              />
              <p>{photosToShow.length} of {photos.length} photo(s)</p>
            </div>
          </CollageView>
        {/if}
        <div class="two-column">
          {#if states.app.showColorWheel}
            <p>Color Wheel Angle</p>
            <input
              type="range"
              bind:value={states.app.colorWheelAngle}
              min="0"
              max="360"
              step="1"
            />
          {/if}
        </div>
      </div>
    </div>
  {/if}

  {#if states.preview.visible}
    <div class="preview-area">
      <h2>Preview</h2>
      <div class="frame three-by">
        {#each stories.filter((c) => c.data?.length).reverse() as collage}
          <div class="border">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <h3 class="fit">
              <button
                on:click={() => {
                  $collageId = collage.id || ""
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
  {#if !hackState.isSignedIn}
    <Toaster />
  {/if}
</main>

<style>
  .off-screen {
    position: absolute;
    left: -1000px;
  }
  main {
    display: grid;
    justify-content: center;
    background-color: var(--color-background);
    width: calc(100cqw - 2px);
    height: calc(100cqh - 6rem);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    overflow-x: hidden;
    overflow-y: auto;
  }

  p {
    padding: 0;
    margin: 0;
    text-align: right;
  }

  .frame {
    justify-content: center;
  }

  .two-column {
    display: grid;
    grid-template-columns: 5rem auto;
    grid-gap: 1rem;
  }

  .three-by {
    display: grid;
    grid-template-columns: repeat(auto-fit, max(20vw, 20rem));
    grid-template-rows: repeat(3, 1fr);
    row-gap: 2rem;
  }

  .border {
    padding: 0.25rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
  }

  .fit {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .toolbar {
    display: grid;
    grid-gap: 0.25rem;
    padding: 0.25rem;
    justify-content: center;
  }

  .status {
    margin: 0 auto;
    margin-top: 3px;
    height: 2rem;
    line-height: 2rem;
    transition-duration: 500ms;
    text-align: center;
    font-size: smaller;
    /* prevent word wrapping */
    white-space: nowrap;
    border: 1px solid var(--color-background);
    width: clamp(15rem, var(--workarea-width), 30rem);
    background-color: var(--color-background);
  }

  .status.loading {
    border-radius: var(--border-radius);
    border-color: var(--color-highlight);
  }

  .preview-area {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: auto;
  }

  .work-area {
    display: grid;
    gap: 1rem;
    padding: 1cqmin;
    overflow: hidden;
    justify-content: center;
  }

  .canvas-viewer {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    margin: 0 auto;
    background-color: var(--color-background-highlight);
    border: var(--color-border) 1px solid;
    z-index: 1;
  }

  canvas {
    width: 50vmin;
    height: 50vmin;
  }
</style>
