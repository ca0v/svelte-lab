import { quintOut } from "svelte/easing";
import { crossfade, fade, scale } from "svelte/transition";
const [send, receive] = crossfade({
  duration: 200,
  delay: 200,
  fallback(node, params) {
    return {
      duration: 100,
      easing: quintOut,
      css: (t) => `opacity: ${t}`,
    };
  },
});

export { send, receive, fade, scale };
