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
    bottom: 0;
    left: 0;
    width: 20em;
    max-height: min(50vh, 5em);
    background-color: var(--color-background-2);
    padding: 1rem;
    border-top-right-radius: 1rem;
    line-height: 2rem;
    opacity: 0.8;
    transition-duration: 200ms;
    border: 1px solid var(--color-border-2);
    border-bottom: none;
    border-left: none;
  }

  .toaster:has(.error) {
    border-color: var(--color-error);
  }

  .toaster.empty {
    opacity: 0.5;
    padding: 0;
    width: 0;
    border: none;
  }

  .toaster > .error {
    border-color: var(--color-error);
  }
</style>
