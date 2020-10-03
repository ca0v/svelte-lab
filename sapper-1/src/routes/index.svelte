<script lang="ts">
  interface Figure {
    icon: string;
    caption: string;
    link: string;
  }

  const figures: Array<Figure> = [
    {
      icon: "logo-512.png",
      caption: "Svelte Examples",
      link: "./examples/svelte",
    },
    {
      icon: "logo-512.png",
      caption: "Sapper Examples",
      link: "./examples/sapper",
    },
    {
      icon: "logo-512.png",
      caption: "What Others Say",
      link: "./links",
    },
  ];
</script>

<style>
  h1,
  h2 {
    text-align: center;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    display: inline-block;
    text-align: center;
  }

  img {
    width: 8em;
  }

  .centered {
    display: grid;
    grid-auto-flow: row;
  }

  @media (min-width: 50em) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Welcome Home</title>
</svelte:head>

<h1>Choose Wisely</h1>
<h2>Think Small</h2>

<div class="centered">
  {#each figures as figure}
    <figure>
      <a href={figure.link}><img alt={figure.caption} src={figure.icon} /></a>
      <figcaption><a href={figure.link}>{figure.caption}</a></figcaption>
    </figure>
  {/each}
</div>
