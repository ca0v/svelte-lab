<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { writable } from "svelte/store"
  import CollageView from "./components/CollageView.svelte"
  import DateRange from "./components/DateRange.svelte"
  import Logo from "./components/Logo.svelte"
  import Toolbar from "./components/Toolbar.svelte"
  import { loadAllStories, stories } from "./store/stories"
  import { collageTemplates as transforms } from "./store/transforms"
  import { commander, contexts } from "./store/commands"

  import Commands from "./components/Commands.svelte"
  import Notes from "./components/Notes.svelte"
  import SvgPaths from "./components/SvgPaths.svelte"
  import { fetchPhotoList, saveCollage } from "./data/collageServices"
  import { addDays, getLocalStorage, log, setLocalStorage } from "./lib/globals"
  import type { ClipPaths, CollageData, Photo } from "./d.ts/index"
  import Toaster from "./components/Toaster.svelte"
  import { toast } from "./store/toasts"
  import {
    command,
    removeCommand,
    shortcut,
    type Command,
  } from "./store/commands"
  import { refreshBaseurl } from "./store/photos"
  import GoogleSignin from "./components/GoogleSignin.svelte"
  import { getClipPathPoints } from "./lib/paths"

  let photos: Array<Photo> = []
  let photosToShow: Array<Photo> = []

  const collageId = writable("")
  let collageView: CollageView

  let activeCollage: CollageData | null = {}
  let activeCollageNote = ""

  const colorWheelAngle = writable(0)

  let states = {
    app: {
      showColorWheel: false,
    },
    menu: {
      isOpen: false,
    },
    saving: false,
    isSignedIn: false,
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

  async function handleAuthClick() {
    // get the google auth2 object
    await loadAllStories()
    states.datefilter.from = states.datefilter.from || asZulu(new Date())
    states.isSignedIn = true

    photos = await getPhotosForOneDay(states.datefilter.from)
    photos.sort((a, b) => a.created!.localeCompare(b.created!))

    collageId.subscribe(async (v) => {
      if (!v) return

      localStorage.setItem("collage_name", v)

      if (!states.isSignedIn) return
      const storyToLoad = $stories.find((h) => h.id === v)
      if (!storyToLoad) throw new Error("Story not found")
      toast("Acquiring story data...")
      await refreshStory(storyToLoad)
      activeCollage = storyToLoad
      activeCollageNote = storyToLoad.note || ""
    })

    $collageId = (await getLocalStorage("collage_name")) || ""
  }

  // assign images to each image element
  async function autoAssignImages(photos: Photo[]) {
    if (!activeCollage?.data) throw new Error("No active collage")
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

  function asZulu(yyyymmdd: string | Date) {
    if (typeof yyyymmdd === "string") {
      const [year, month, day] = yyyymmdd.split("-").map((v) => parseInt(v))
      const result = new Date(year, month - 1, day).toISOString()
      return result
    } else {
      return yyyymmdd.toISOString().split("T")[0]
    }
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

  function createUniqueId(): string {
    return Math.random()
      .toString(36)
      .substring(2, 16 + 2)
  }

  async function refreshStory(story: CollageData) {
    if (story?.data) {
      await refreshBaseurl(story.data)
    }
  }

  $: states.datefilter.from &&
    localStorage.setItem("date_filter", states.datefilter.from)
  $: states.datefilter.to =
    states.datefilter.to || addDays(states.datefilter.from, 1)

  $: {
    if (states.isSignedIn && states.datefilter.from && states.datefilter.to) {
      const from = asZulu(states.datefilter.from)
      const to = asZulu(states.datefilter.to)
      getPhotosForOneDay(from).then((photos) => {
        photos = photos.filter((p) => {
          return from <= p.created! && p.created! < to
        })
        photos.sort((a, b) => a.created!.localeCompare(b.created!))
        photosToShow = photos
      })
    }
  }

  onMount(async () => {
    contexts.file
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
        event: "save_story",
        name: "Save",
        title: "Save story",
        trigger: {
          key: "s",
        },
        execute: async () => {
          if (!activeCollage) throw new Error("No active collage")
          states.saving = true
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

            log({ activeCollage })

            await saveCollage({ ...activeCollage })
            toast("Saved")
          } catch (ex) {
            reportError(ex)
            toast(`Error: ${ex}`)
          } finally {
            states.saving = false
          }
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
          stories.update((s) => [newStory, ...s])
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
    commander.listen()

    states.datefilter.from = localStorage.getItem("date_filter") || ""

    $colorWheelAngle = await getLocalStorage("colorwheel_angle", 0)
    colorWheelAngle.subscribe(async (v) => {
      toast(`Color wheel angle: ${v}deg`)
      setLocalStorage("colorwheel_angle", v)
      document.documentElement.style.setProperty("--theme-hue", `${v}`)
    })

    contexts.workarea
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
        event: "zoom-in-workarea",
        name: "Zoom Workarea In",
        trigger: {
          key: "ArrowUp",
        },
        execute: () => {
          states.editor.width = Math.min(states.editor.width + 1, 200)
          return true
        },
      })
      .addCommand({
        event: "zoom-out-workarea",
        name: "Zoom Workarea Out",
        trigger: {
          key: "ArrowDown",
        },
        execute: () => {
          states.editor.width = Math.max(states.editor.width - 1, 25)
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

    commander.primaryContext.addCommand({
      name: "Preview",
      event: "preview",
      title: "Preview collage",
      trigger: {
        key: "p",
        isAlt: true,
      },
      execute: () => (states.preview.visible = !states.preview.visible),
    })

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
    removeCommand("preview")
    removeCommand("toggle_edit_mode")
    removeCommand("toggle-color-wheel")
    removeCommand("goto-photowheel")
    removeCommand("zoom-in-workarea")
    removeCommand("zoom-out-workarea")

    Object.keys($transforms).forEach(removeCommand)

    document.querySelectorAll("[data-shortcut]").forEach((element) => {
      if (element instanceof HTMLElement) {
        removeCommand(`goto-${element.title}`)
      } else {
        throw new Error("Unexpected element type")
      }
    })
  })

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

<Commands bind:isOpen={states.menu.isOpen}>
  <GoogleSignin autoSignIn={false} />
</Commands>

<main>
  {#if states.isSignedIn}
    <div>
      <h1>just.be.collage</h1>
      <h2>Collage Builder</h2>
    </div>
    <SvgPaths />
  {:else}
    <Logo>
      <GoogleSignin autoSignIn={true} on:signedin={handleAuthClick} /></Logo
    >
  {/if}

  {#if states.isSignedIn}
    <div class="frame">
      <div class="work-area">
        <Toolbar />
        <div class="two-column">
          <p>S<u>t</u>ories</p>
          {#if !$stories.length}
            <button use:command={"start_new_story"} />
          {:else}
            <select
              bind:value={$collageId}
              use:shortcut={{ key: "t", isAlt: true, editmode: true }}
              title="Select an existing story"
            >
              {#each $stories.sort( (a, b) => (a.title || "").localeCompare(b.title || "") ) as collage}
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
            <div class="spacer" />
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
              bind:value={$colorWheelAngle}
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
        {#each $stories.filter((c) => c.data?.length).reverse() as collage}
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
</main>

<Toaster />

<style>
  main {
    display: grid;
    justify-content: center;
    background-color: var(--color-background);
    width: calc(100cqw - 2px);
    height: calc(100cqh - 2px);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
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
    grid-template-columns: repeat(4, 20vw);
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
  }

  .work-area {
    display: grid;
    gap: 1rem;
    container-type: inline-size;
    padding: 1cqmin;
    overflow: auto;
    height: calc(100cqh - 10rem);
    justify-content: center;
    width: max(320px, 80cqw);
  }
</style>
