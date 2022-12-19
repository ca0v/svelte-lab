<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import CollageView from "./components/CollageView.svelte"
  import DateRange from "./components/DateRange.svelte"
  import { stories } from "./store/stories"
  import { collageTemplates as transforms } from "./store/transforms"

  import Commands from "./components/Commands.svelte"
  import Notes from "./components/Notes.svelte"
  import SvgPaths from "./components/SvgPaths.svelte"
  import {
    asPhotoServiceUrl,
    fetchPhotoList,
    saveCollage,
  } from "./data/collageServices"
  import { addDays, extractId, setLocalStorage } from "./lib/globals"
  import type { Photo } from "./data/Api"
  import Toaster from "./components/Toaster.svelte"
  import { toast } from "./store/toasts"
  import { addCommand, removeCommand } from "./store/commands"

  let photos: Array<Photo> = []
  let collageId = ""

  let states = {
    saving: false,
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

  $: states.datefilter.from &&
    localStorage.setItem("date_filter", states.datefilter.from)
  $: activeCollage = collageId && $stories.find((h) => h.id === collageId)
  $: collageId && localStorage.setItem("collage_name", collageId)
  $: photosToShow = photos.filter(
    (p) =>
      !states.datefilter.from ||
      (asZulu(states.datefilter.from) <= p.created &&
        p.created <= asZulu(states.datefilter.to))
  )

  onMount(async () => {
    states.datefilter.from = localStorage.getItem("date_filter") || ""
    collageId = localStorage.getItem("collage_name") || ""
    photos = await fetchPhotoList()
    photos.sort((a, b) => a.created.localeCompare(b.created))
    states.datefilter.from =
      states.datefilter.from || photos[0]?.created.split("T")[0] || ""

    states.datefilter.to =
      states.datefilter.to || addDays(states.datefilter.from, 1)

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
          key: i >= 40 ? "" : (i % 10) + 1 + "",
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

    document
      .querySelectorAll("[data-shortcut]")
      .forEach((element: HTMLElement) => {
        const shortcut = element
          .getAttribute("data-shortcut")
          .split(">")
          .reverse()

        const command = {
          name: `goto-${element.title}`,
          title: element.title,
          trigger: {
            key: shortcut[0],
            isShift: shortcut.includes("Shift"),
            isCtrl: shortcut.includes("Ctrl"),
            isAlt: shortcut.includes("Alt"),
          },
          execute: () => {
            element.focus()
            return true
          },
        }
        addCommand(command)
      })
  })

  onDestroy(() => {
    Object.keys($transforms).forEach(removeCommand)

    document
      .querySelectorAll("[data-shortcut]")
      .forEach((element: HTMLElement) => {
        removeCommand(`goto-${element.title}`)
      })
  })
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
      collageId = newStory.id
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
    on:auto_assign_photos={() =>
      autoAssignImages(photosToShow.map(asPhotoServiceUrl))}
    on:clear_all_photos={() => clearAllImages()}
  />

  <h1>Just.Collage</h1>

  <div class="frame">
    <h2>Photo Collage Editor</h2>
    <div class="two-column">
      <p>S<u>t</u>ories</p>
      <select
        bind:value={collageId}
        data-shortcut="Shift>T"
        title="Select an existing story"
      >
        {#each $stories as collage}
          <option value={collage.id}>{collage.title}</option>
        {/each}
      </select>
      <p>Title</p>
      <input
        type="text"
        bind:value={activeCollage.title}
        title="Edit the title for this story"
        disabled={!activeCollage}
      />
      {#if activeCollage}
        <p><u>N</u>otes</p>
        <Notes shortcut="Shift>N" bind:note={activeCollage.note} />
      {/if}
    </div>
    <div class="spacer" />
    {#if activeCollage}
      <CollageView
        id={collageId}
        transforms={activeCollage}
        bind:editmode={states.editor.editmode}
        on:save={async () => {
          throw "not supported, remove"
        }}
        sources={photosToShow.map(asPhotoServiceUrl)}
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
  </div>

  {#if states.preview.visible}
    <div class="preview-area">
      <h2>Preview</h2>
      <div class="frame three-by">
        {#each $stories.filter((c) => c.data?.length).reverse() as collage, i}
          <div class="border">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <h3 class="fit">
              <button
                on:click={() => {
                  collageId = collage.id
                  states.preview.visible = false
                }}
              >
                {collage.title}
              </button>
            </h3>
            <CollageView
              id={`view_${collage.id}`}
              readonly={true}
              transforms={collage}
            />
          </div>
        {/each}
      </div>
    </div>
  {/if}
</main>

<Toaster />

<style>
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
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    grid-gap: 0.25rem;
    padding: 0.25rem;
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
</style>
