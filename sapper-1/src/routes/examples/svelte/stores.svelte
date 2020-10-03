<script>
  import { like as inc, dislike as dec } from "../../../data/datastores";
</script>

<h1>Stores</h1>

<button on:click={inc}>Like</button>
<button on:click={dec}>Dislike</button>
