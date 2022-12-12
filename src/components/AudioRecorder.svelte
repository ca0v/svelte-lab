<script lang="ts">
  import { onMount } from "svelte"
  import {
    deleteAudioRecording,
    getAllAudioRecordings,
    saveAudioRecording,
    type AudioRecording,
  } from "../lib/db"

  let stop: HTMLButtonElement
  let record: HTMLButtonElement
  let soundClips: HTMLElement
  let mainSection: HTMLElement
  let mediaRecorder: MediaRecorder
  const chunks_1 = []

  let recordings: Array<{ title: string; blob: any }> = []

  function recordClickHandler() {
    mediaRecorder.start()
    console.log(mediaRecorder.state)
    console.log("recorder started")
    record.style.background = "red"
    stop.disabled = false
    record.disabled = true
  }

  function stopClickHandler() {
    mediaRecorder.stop()
    console.log(mediaRecorder.state)
    console.log("recorder stopped")
    record.style.background = ""
    record.style.color = ""
    // mediaRecorder.requestData();
    stop.disabled = true
    record.disabled = false
  }

  function stopMediaRecorderHandler() {
    console.log("data available after MediaRecorder.stop() called.")

    recordings = [
      {
        title: `Recording ${recordings.length + 1}`,
        blob: new Blob(chunks_1, { type: "audio/ogg; codecs=opus" }),
      },
      ...recordings,
    ]
  }

  async function demo() {
    stop.disabled = true

    //main block for doing the audio recording
    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm; codecs=opus",
        })

        mediaRecorder.addEventListener("stop", stopMediaRecorderHandler)
        mediaRecorder.ondataavailable = function (e) {
          chunks_1.push(e.data)
        }
      }
    } else {
      console.log("getUserMedia not supported on your browser!")
    }
  }

  onMount(() => {
    demo()
    recordings = getAllAudioRecordings()
  })

  function deleteRecording(recording: AudioRecording): any {
    const index = recordings.indexOf(recording)
    recordings.splice(index, 1)
    recordings = recordings
    deleteAudioRecording(recording)
  }

  async function saveRecording(recording: AudioRecording) {
    saveAudioRecording(recording)
  }
</script>

<div>
  <div class="wrapper">
    <section bind:this={mainSection} class="main-controls">
      <div id="buttons">
        <button bind:this={record} class="record" on:click={recordClickHandler}
          >Record</button
        >
        <button bind:this={stop} class="stop" on:click={stopClickHandler}
          >Stop</button
        >
      </div>
    </section>

    <section bind:this={soundClips} class="sound-clips">
      {#each recordings as recording, i}
        <article class="clip">
          <audio controls src={URL.createObjectURL(recording.blob)} />
          <p>{recording.title}</p>
          <button class="delete" on:click={() => deleteRecording(recording)}
            >Delete</button
          >
          <button on:click={() => saveRecording(recording)}>Save</button>
        </article>
      {/each}
    </section>
  </div>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
