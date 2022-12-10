<script lang="ts">
  import { onMount } from "svelte"
  import { photoUrl as PHOTOS } from "./lib/globals"
  import HexagonSpiral from "./components/HexagonSpiral.svelte"
  import { transforms, hexagons } from "./data/hexagons"
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

  let spiralName = "phase-1"
  let transformName = "spiral-19"
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
    console.log({ date_filter, date_filter_to })
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
      <legend>Builder settings for {spiralName} on a {transformName}</legend>
      <label
        >Collage Name:
        <select bind:value={spiralName}>
          {#each hexagons as collage}
            <option value={collage.id}>{collage.id}</option>
          {/each}
        </select></label
      >
      <label
        >Transform:
        <select bind:value={transformName}>
          {#each Object.entries(transforms) as [name]}<option value={name}
              >{name}</option
            >
          {/each}
        </select>
      </label>
      <label
        >From:
        <input type="date" bind:value={date_filter} /> to {date_filter_to}</label
      >
    </fieldset>
    <HexagonSpiral
      id={spiralName}
      collageName={spiralName}
      transform={transforms[transformName]}
      duration={0.2}
      sources={photos
        .filter(
          (p) =>
            !date_filter ||
            (date_filter <= p.created && p.created <= date_filter_to)
        )
        .map((p) => `${PHOTOS}/get?id=${p.filename}`)}
    />
  </div>

  <h2>For Viewing</h2>
  <div class="frame two-by">
    {#each hexagons as collage, i}
      <div>
        <HexagonSpiral
          id={`view_${collage.id}`}
          collageName={collage.id}
          duration={0.5 + i * 0.1}
          readonly={true}
          transform={transforms[collage.transform]}
        />
      </div>
    {/each}
  </div>
</main>

<style>
  .two-by {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  fieldset {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  fieldset label {
    text-align: left;
  }

  .frame {
    justify-content: center;
    width: calc(clamp(20rem, 100vw, 100rem) - 2rem);
  }
</style>
