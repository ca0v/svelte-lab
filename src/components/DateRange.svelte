<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { addDays, dow } from "../lib/globals"
  import { addCommand, removeCommand } from "../store/commands"

  export let date_filter_from: string = ""
  export let date_filter_to: string = ""

  $: {
    date_filter_to = addDays(date_filter_from, 1)
  }

  onMount(() => {
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
  })

  onDestroy(() => {
    removeCommand("prior_day")
    removeCommand("next_day")
  })
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
