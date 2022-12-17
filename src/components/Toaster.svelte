<script lang="ts">
  import { toasts } from "../store/toasts"
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class:empty={!$toasts.length}
  class="toaster"
  on:click={() => toasts.set([])}
>
  {#each $toasts as toast}
    <div class:error={toast.level == "err"}>{toast.message}</div>
  {/each}
</div>

<style>
  .toaster {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    width: 20em;
    max-height: 50vh;
    background-color: #333;
    padding: 1rem;
    border-radius: 1rem;
    line-height: 2rem;
    opacity: 0.8;
    transition-duration: 200ms;
    border: 1px solid green;
  }

  .toaster:has(.error) {
    border-color: red;
  }

  .toaster.empty {
    opacity: 0.5;
    padding: 0;
    width: 0;
    border: none;
  }

  .toaster > .error {
    color: red;
  }
</style>
