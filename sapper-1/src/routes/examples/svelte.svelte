<script>
  import { send, receive, fade, scale } from "./fun/transitions";
</script>

<div class="crossfade">
  <h1 transition:fade>Svelte Examples</h1>
  <li><a href="./examples/svelte/transitions">Blah</a></li>
  <li><a href="./examples/svelte/transitions">Blah</a></li>
  <li in:receive={{ key: 'you' }} out:send={{ key: 'you' }}>
    <a href="./examples/svelte/transitions">Transitions</a>
  </li>
</div>
