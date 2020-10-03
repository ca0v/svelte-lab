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

<figure>
  <img alt="Svelte" src="logo-512.png" />
  <figcaption><a href="./examples/svelte">Svelte Examples</a></figcaption>
</figure>

<figure>
  <img alt="Sapper" src="logo-512.png" />
  <figcaption><a href="./examples/sapper">Sapper Examples</a></figcaption>
</figure>

<figure>
  <img alt="Sapper" src="logo-512.png" />
  <figcaption><a href="./links">What Others Say</a></figcaption>
</figure>
