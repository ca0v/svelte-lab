<script>
  let html = `<a href="./examples/sapper/links">Links</a>`;
  let wrongLink = `<a href="./links">external links</a>`;
</script>

<h1>Sapper Links</h1>
<ul>
  <li>
    To link to a svelte file omit the .svelte extension
    <code>{html}</code>
    {@html html}
  </li>

  <li>
    Links are relative to the routes folder so
    <code>{wrongLink}</code>
    {@html wrongLink}
    is not this page.
  </li>
</ul>
