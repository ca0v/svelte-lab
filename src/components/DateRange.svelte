<script lang="ts">
  import { addCommand } from "../store/commands"

  addCommand({
    name: "prior_day",
    title: "Show prior photos",
    trigger: {
      key: "ArrowLeft",
    },
    execute: () => {
      date_filter_from = addDays(date_filter_from, -1)
    },
  })

  addCommand({
    name: "next_day",
    title: "Show later photos",
    trigger: {
      key: "ArrowRight",
    },
    execute: () => {
      date_filter_from = addDays(date_filter_from, 1)
    },
  })

  export let date_filter_from: string = ""
  export let date_filter_to: string = ""

  function addDays(date_filter: string, arg1: number): string {
    if (!date_filter) return date_filter
    const currentDate = new Date(date_filter)
    currentDate.setDate(currentDate.getDate() + arg1)
    return currentDate.toISOString().split("T")[0]
  }

  $: {
    date_filter_to = addDays(date_filter_from, 1)
  }

  function dow(yyyymmdd: string) {
    const [year, month, day] = yyyymmdd.split("-").map((v) => parseInt(v))
    const result = new Date(year, month - 1, day).getDay()
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][result]
  }
</script>

<div class="toolbar">
  {#if date_filter_from}
    <button
      class="prev"
      data-shortcut="P"
      on:click={() => {
        date_filter_from = addDays(date_filter_from, -1)
      }}>{dow(addDays(date_filter_from, -1))}</button
    >{/if}
  <input type="date" bind:value={date_filter_from} />
  {#if date_filter_from}
    <button
      class="next"
      data-shortcut="N"
      on:click={() => {
        date_filter_from = addDays(date_filter_from, 1)
      }}>{dow(addDays(date_filter_from, +1))}</button
    >
  {/if}
</div>

<style>
  /* css for move-to-next button */
  .next::after {
    content: " →";
  }

  .prev::before {
    content: "← ";
  }

  input[type="date"] {
    text-align: center;
  }

  .toolbar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
    grid-auto-rows: 1.5rem;
    gap: 0.25em;
    max-width: 45rem;
  }
</style>
