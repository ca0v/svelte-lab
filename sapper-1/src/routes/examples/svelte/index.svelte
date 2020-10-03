<script>
  import { send, receive, fade, scale } from "../fun/transitions";
  import SvelteExamples from "./_examples.svelte";
</script>

<h1 transition:fade>Svelte Examples</h1>
<SvelteExamples />

<li in:receive={{ key: 'you' }} out:send={{ key: 'you' }}>
  <a href="./examples/svelte/transitions">Transitions</a>
</li>
