## Svelte Sample Apps
[sapper-1](https://ca0v.github.io/svelte-lab/apps/sapper-1)

### Notes
Sapper is a static site generator and needs to be configured to generate to a specific path.  That required making changes to server.ts and package.json.

server.ts - I added `"svelte-lab/apps/sapper-1"`

```
polka() // You can also use Express
  .use(
    "svelte-lab/apps/sapper-1",
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
  ```

  package.json - I also added `"svelte-lab/apps/sapper-1"`

  ```
    "export": "sapper export --basepath svelte-lab/apps/sapper-1",
  ```

Move the build artifacts so the path makes sense when hosted at https://ca0v.github.io/svelte-lab/apps/sapper-1/

 ```
    "deploy": "mv __sapper__/export/svelte-lab/apps/sapper-1/ ../apps/sapper-1/"
  ```

