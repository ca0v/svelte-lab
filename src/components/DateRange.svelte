<script lang="ts">
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
</script>

<div class="toolbar">
  {#if date_filter_from}
    <button
      class="prev"
      data-shortcut="P"
      on:click={() => {
        date_filter_from = addDays(date_filter_from, -1)
      }}>{addDays(date_filter_from, -1)}</button
    >{/if}
  <input type="date" bind:value={date_filter_from} />
  {#if date_filter_from}
    <button
      class="next"
      data-shortcut="N"
      on:click={() => {
        date_filter_from = addDays(date_filter_from, 1)
      }}>{addDays(date_filter_from, +1)}</button
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
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 1.5rem;
    gap: 1em;
    min-width: 10rem;
    max-width: 45rem;
    margin: 0 auto;
  }
</style>
