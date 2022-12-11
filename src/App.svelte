<script lang="ts">
  import { onMount } from "svelte"
  import { photoUrl as PHOTOS } from "./lib/globals"
  import HexagonSpiral from "./components/HexagonSpiral.svelte"
  import { transforms, hexagons as collages } from "./data/hexagons"
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
      return data.map((d) => ({
        ...d,
        created: new Date(d.created).toISOString().split("T")[0],
      }))
    }
    throw new Error("Failed to fetch photo list")
  }

  let collageName = ""
  let transformName = ""
  let date_filter = ""
  let date_filter_to = ""

  $: {
    if (date_filter) {
      const d = new Date(date_filter)
      d.setDate(d.getDate() + 0)
      date_filter_to = d.toISOString().split("T")[0]
    } else {
      date_filter_to = ""
    }

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
              href: "",
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
    photos = await fetchPhotoList()
    date_filter = photos[0]?.created || ""
  })
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
              <option value={collage.id}>{collage.id}</option>
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
        <button
          data-shortcut="P"
          on:click={() => {
            const currentDate = new Date(date_filter)
            currentDate.setDate(currentDate.getDate() - 1)
            date_filter = currentDate.toISOString().split("T")[0]
          }}>&lt;&lt; <u>P</u>rior</button
        >
        <label
          >From:
          <input type="date" bind:value={date_filter} /> to {date_filter_to}</label
        ><button
          data-shortcut="N"
          on:click={() => {
            const currentDate = new Date(date_filter)
            currentDate.setDate(currentDate.getDate() + 1)
            date_filter = currentDate.toISOString().split("T")[0]
          }}><u>N</u>ext &gt;&gt;</button
        >
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
        .map((p) => `${PHOTOS}/get?id=${p.filename}`)}
    />
  </div>

  {#if true}
    <h2>For Viewing</h2>
    <div class="frame two-by">
      {#each collages as collage, i}
        <div>
          <HexagonSpiral
            id={`view_${collage.id}`}
            collageName={collage.id}
            duration={0.5 + i * 0.1}
            readonly={true}
            transform={collage}
          />
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  .two-by {
    display: flex;
    grid-template-columns: repeat(2, 1fr);
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

  h2,
  h1 {
    text-align: center;
  }
</style>
