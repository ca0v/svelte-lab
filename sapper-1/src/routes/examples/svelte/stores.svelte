<script>
  import { likes } from "../data/datastores";

  function inc() {
    $likes = $likes + 1;
  }

  function dec() {
    $likes = $likes - 1;
  }
</script>

<h1>Stores</h1>

<button on:click={inc}>Like</button>
<button on:click={dec}>Dislike</button>

<p>You have {$likes} likes</p>
