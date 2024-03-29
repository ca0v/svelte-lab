<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { signin, signout } from "@googlePhoto/googleApi"
  import { reportExceptions, toast } from "../store/toasts"
  import {
    authenticatedWithGoogle,
    authorizedWithGooglePhotos,
  } from "../store/general"

  const dispatch = createEventDispatcher()

  export let autoSignIn = true

  async function handleSigninClick() {
    if (!$authenticatedWithGoogle) await signin()
    $authenticatedWithGoogle = true
    dispatch("signedin")
  }

  function handleSignoutClick() {
    if ($authenticatedWithGoogle) {
      signout()
      $authenticatedWithGoogle = false
    }
    dispatch("signedout")
  }

  autoSignIn &&
    setTimeout(() => {
      toast("Automatic sign in to Google Photos")
      handleSigninClick()
    }, 1000)
</script>

<section class="toolbar">
  <input
    type="button"
    disabled={!$authenticatedWithGoogle}
    class="google_photos_button"
    value="Sign out from Google Photos"
    on:click={reportExceptions(handleSignoutClick)}
  />
  <input
    type="button"
    disabled={$authenticatedWithGoogle}
    class="google_photos_button"
    value="Connect to Google Photos"
    on:click={reportExceptions(handleSigninClick)}
  />
</section>

<style>
  @media (prefers-color-scheme: dark) {
    .google_photos_button {
      background-color: var(--color-google-gray);
      color: #ccc;
    }
  }

  @media (prefers-color-scheme: light) {
    .google_photos_button {
      background-color: var(--color-google-white);
      color: var(--color-google-gray);
    }
  }

  .google_photos_button {
    --color-google-white: #ffffff;
    --color-google-gray: #3c4043;
    background-image: url(/google_photos_icon.png);
    background-repeat: no-repeat;
    background-position: 8px 8px;
    background-size: 24px 24px;
    padding-left: calc(8px + 24px + 16px);
    padding-right: 16px;
    height: 40px;
    border-radius: 4px;
  }

  .google_photos_button:disabled {
    display: none;
  }

  .toolbar {
    display: grid;
    grid-gap: 0.25rem;
    padding: 0.25rem;
    justify-content: center;
  }

  .toolbar > input {
    width: fit-content;
  }
</style>
