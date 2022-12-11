<script lang="ts">
  import { onMount } from "svelte"
  import { photoUrl as PHOTOS } from "./lib/globals"
  import HexagonSpiral from "./components/HexagonSpiral.svelte"
  import {
    transforms,
    collages,
    type Photo,
    type Hexagon,
  } from "./data/hexagons"

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
  let date_filter = ""
  let date_filter_to = ""

  $: {
    date_filter_to = addDays(date_filter, 1)
    date_filter && localStorage.setItem("date_filter", date_filter)
    const transform = transforms[transformName] as Array<{
      i: string
      style: string
    }>
    if (transform) {
      const collage = collages.find((h) => h.id === collageName)
      if (collage) {
        // inject transforms not found in collage
        transform.forEach((t) => {
          const collageInfo = collage.data.find((c) => c.target === "i" + t.i)
          if (!collageInfo) {
            console.log("adding transform:", t.i)
            collage.data.push({
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
    date_filter = localStorage.getItem("date_filter") || ""
    photos = await fetchPhotoList()
    date_filter = date_filter || photos[0]?.created.split("T")[0] || ""
  })

  function addDays(date_filter: string, arg1: number): string {
    if (!date_filter) return date_filter
    const currentDate = new Date(date_filter)
    currentDate.setDate(currentDate.getDate() + arg1)
    return currentDate.toISOString().split("T")[0]
  }
</script>

<main>
  <h1>Photo Playground</h1>

  <div class="frame">
    <h2>For Editing</h2>
    <fieldset>
      <legend>Builder settings for {collageName} on a {transformName}</legend>
      <div>
        <label
          ><u>C</u>ollage Name:
          <select bind:value={collageName} data-shortcut="C">
            {#each collages as collage}
              <option value={collage.id}>{collage.title}</option>
            {/each}
          </select></label
        >
      </div>
      <label
        ><u>T</u>ransform:
        <select data-shortcut="T" bind:value={transformName}>
          {#each Object.entries(transforms) as [name]}<option value={name}
              >{name}</option
            >
          {/each}
        </select>
      </label>
      <div class="toolbar">
        {#if date_filter}
          <button
            data-shortcut="P"
            on:click={() => {
              date_filter = addDays(date_filter, -1)
            }}
            >&lt;&lt; {new Date(
              addDays(date_filter, -1)
            ).toDateString()}</button
          >{/if}
        <label> <input type="date" bind:value={date_filter} /></label>
        {#if date_filter}
          <button
            data-shortcut="N"
            on:click={() => {
              date_filter = addDays(date_filter, 1)
            }}>{new Date(date_filter_to).toDateString()} &gt;&gt;</button
          >
        {/if}
      </div>
    </fieldset>
    <HexagonSpiral
      id={collageName}
      {collageName}
      transform={collages.find((h) => h.id === collageName)}
      duration={0.01}
      sources={photos
        .filter(
          (p) =>
            !date_filter ||
            (date_filter <= p.created && p.created <= date_filter_to)
        )
        .map((p) => `${PHOTOS}/get?id=${p.id}`)}
    />
  </div>

  {#if true}
    <h2>Preview</h2>
    <div class="frame three-by">
      {#each collages.filter((c) => c.data.length) as collage, i}
        <div class="border">
          <p>{collage.title}</p>
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
  .three-by {
    display: grid;
    grid-template-columns: repeat(4, 20vw);
    grid-template-rows: repeat(3, 1fr);
    row-gap: 2rem;
  }

  fieldset {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 1rem;
  }

  .frame {
    justify-content: center;
    width: calc(clamp(20rem, 100vw, 100rem) - 2rem);
  }

  .toolbar {
    display: flex;
    gap: 1em;
  }

  p,
  h2,
  h1 {
    text-align: center;
  }

  .border {
    border: 1px solid rgba(200, 200, 200, 0.5);
  }

  main {
    margin-bottom: 5rem;
  }
</style>
