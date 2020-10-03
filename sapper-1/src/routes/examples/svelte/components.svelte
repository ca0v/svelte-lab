<script>
  import LikeButton from "../_components/LikeButton.svelte";
  const likeButtonHtml = `<LikeButton topic="Components" />`;
</script>

<h1>Components</h1>

<p>
  A component is a .svelte file used to define a custom DOM Element. In this
  case I created a LikeButton.svelte component and consume it using
  <code>{likeButtonHtml}</code>
  to produce this
  <LikeButton topic="Components" />

  I could now modify my Footer component to make use of this new LikeButton
  component. I can also reuse the component for a different topic:
  <LikeButton topic="Repetition" />
</p>
