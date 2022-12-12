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

  let audioPlayer: HTMLAudioElement

  const chunks_1 = []

  let recordings: Array<AudioRecording> = []

  async function recordClickHandler() {
    await startListening()
    mediaRecorder.start()
    console.log(mediaRecorder.state)
    console.log("recorder started")
    stop.disabled = false
    record.disabled = true
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

    recordings = [recording, ...recordings]

    chunks_1.length = 0
    saveRecording(recording)

    stopListening()
  }

  let stream: MediaStream

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

  onMount(() => {
    recordings = getAllAudioRecordings()
  })

  function deleteRecording(recording: AudioRecording): any {
    const index = recordings.indexOf(recording)
    recordings.splice(index, 1)
    recordings = recordings
    deleteAudioRecording(recording)
  }

  function playRecording(recording: AudioRecording) {
    audioPlayer.src = URL.createObjectURL(recording.blob)
    audioPlayer.play()
  }

  async function saveRecording(recording: AudioRecording) {
    saveAudioRecording(recording)
  }

  const appStartTime = Date.now()
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
    <section bind:this={mainSection} class="main-controls">
      <div id="buttons">
        <button
          bind:this={record}
          class="record"
          on:click={recordClickHandler}
        />
        <button bind:this={stop} class="stop" on:click={stopClickHandler} />
      </div>
    </section>

    <section bind:this={soundClips} class="sound-clips">
      <audio bind:this={audioPlayer} />
      {#each recordings as recording, i}
        <article>
          <input type="text" bind:value={recording.title} />
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
</style>
