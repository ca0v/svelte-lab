<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import type { AudioRecording } from "../lib/db"

  export let recordings: Array<AudioRecording> = []

  const chunks_1 = [] as any[]
  const dispatch = createEventDispatcher()
  const appStartTime = Date.now()

  let stop: HTMLButtonElement
  let record: HTMLButtonElement
  let mediaRecorder: MediaRecorder

  let audioPlayer: HTMLAudioElement
  let stream: MediaStream

  async function recordClickHandler() {
    try {
      await startListening()
      mediaRecorder.start()
      console.log(mediaRecorder.state)
      console.log("recorder started")
      stop.disabled = false
      record.disabled = true
    } catch (e) {
      // emit this error on the document body
      // so that it can be caught by the error
      // boundary
      window.dispatchEvent(new CustomEvent("error", { detail: e }))
    }
  }

  function stopClickHandler() {
    mediaRecorder.stop()
    console.log(mediaRecorder.state)
    console.log("recorder stopped")
    // mediaRecorder.requestData();
    stop.disabled = true
    record.disabled = false
  }

  function stopMediaRecorderHandler() {
    console.log("data available after MediaRecorder.stop() called.")

    const recording = {
      id: Date.now().toString(),
      title: `Recording ${timeSinceAppStarted()}`,
      blob: new Blob(chunks_1, { type: "audio/ogg; codecs=opus" }),
    }

    chunks_1.length = 0
    saveRecording(recording)

    stopListening()
  }

  async function startListening() {
    stop.disabled = true

    //main block for doing the audio recording
    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true }

      stream = await navigator.mediaDevices.getUserMedia(constraints)
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

  function stopListening() {
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.stop()
    }
    stream?.getTracks().forEach((track) => track.stop())
  }

  function deleteRecording(recording: AudioRecording): any {
    dispatch("delete", { id: recording.id })
  }

  function playRecording(recording: AudioRecording) {
    if (!recording.url) {
      recording.url = URL.createObjectURL(recording.blob!)
    }
    audioPlayer.src = recording.url
    audioPlayer.play()
  }

  async function saveRecording(recording: AudioRecording) {
    dispatch("save", recording)
  }

  function timeSinceAppStarted() {
    const currentTime = Date.now()
    const secondsSinceAppStarted = (currentTime - appStartTime) / 1000
    const mm = Math.floor(secondsSinceAppStarted / 60) + ""
    const ss = Math.floor(secondsSinceAppStarted % 60) + ""

    return `${mm.padStart(2, "0")}:${ss.padStart(2, "0")}`
  }
</script>

<div>
  <div class="wrapper">
    <section class="main-controls">
      <div id="buttons">
        <button
          bind:this={record}
          class="record"
          on:click={async () => await recordClickHandler()}
        />
        <button
          bind:this={stop}
          class="stop"
          on:click={stopClickHandler}
          disabled
        />
      </div>
    </section>

    <section class="sound-clips">
      <audio bind:this={audioPlayer} />
      {#each recordings as recording}
        <article>
          <input
            type="text"
            bind:value={recording.title}
            on:change={() => dispatch("track-title-change", recording)}
          />
          <button class="play" on:click={() => playRecording(recording)} />
          <button class="delete" on:click={() => deleteRecording(recording)} />
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

  /* css for a record button  */
  button {
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 24px;
    height: 24px;
  }

  article {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* css for a delete button  */
  .delete {
    background-color: red;
    color: white;
  }

  .delete:before {
    content: "✖";
  }
  .play:before {
    content: "▶";
  }
  .stop:before {
    content: "■";
  }
  .record:before {
    content: "●";
  }

  /* css for a play button  */
  .play {
    background-color: green;
    color: white;
  }

  /* css for a stop button  */
  .record:not(:disabled) {
    background-color: white;
    color: red;
  }

  .stop:not(:disabled) {
    background-color: red;
    color: white;
  }
</style>
