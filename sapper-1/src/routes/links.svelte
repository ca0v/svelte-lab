<script lang="ts">
  interface Link {
    href: string;
    caption?: string;
  }

  const links: Array<Link> = [
    {
      href: "https://ca0v.github.io/svelte-lab/apps/sapper-1/",
      caption: "My Learning Sapper App",
    },
    {
      href: "https://sapper.svelte.dev",
      caption: "The Actual Sapper Site",
    },
    {
      href: "https://madewithsvelte.com/",
      caption: "Made with Sveltes",
    },
    {
      href: "https://dev.to/buhrmi/svelte-component-transitions-5ie",
      caption: "Transitions",
    },
    {
      href: "https://svelte.dev/repl/hello-world?version=3.29.0",
      caption: "REPL",
    },
  ].sort((a, b) => (a.caption || a.href).localeCompare(b.caption || b.href));
</script>

<style>
  .grid {
    display: grid;
    grid-template-columns: auto;
  }
</style>

<h1>External Links</h1>

<div class="grid">
  {#each links as link}
    <a href={link.href}>{link.caption || link.href}</a>
  {/each}
</div>
