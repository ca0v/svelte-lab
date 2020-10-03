<style>
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 20em;
    margin: 0 0 1em 0;
  }

  p {
    margin: 1em auto;
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

<h1>Pick a Faction</h1>

<a href="./examples/svelte">
  <figure>
    <img alt="Svelte" src="logo-512.png" />
    <figcaption>Svelte Examples</figcaption>
  </figure>
</a>

<a href="./examples/sapper">
  <figure>
    <img alt="Sapper" src="logo-512.png" />
    <figcaption>Sapper Examples</figcaption>
  </figure></a>

<p><strong>Think Small</strong></p>

<a href="./links">Links</a>
