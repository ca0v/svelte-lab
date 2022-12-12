type AudioRecording = {
    title: string
    blob: Blob
}

function getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item) {
        return JSON.parse(item) as T;
    }
    return null;
}

function setItem<T>(key: string, item: T) {
    localStorage.setItem(key, JSON.stringify(item));
}

async function saveAudioRecording(recording: AudioRecording) {
    // save to local storage
    const { title, blob } = recording;
    const index = getItem<Array<{ id: string; title: string, type: string }>>('audio.recordings') || [];

    let id = index.find(v => v.title === title)?.id;
    if (!id) {
        id = index.length + 1 + '';
        index.push({ id, title, type: blob.type });
    }


    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = () => {
        // convert data to base64 string
        const data = new Uint8Array(reader.result as ArrayBuffer).join(",");
        setItem(`audio.recordings.${id}`, data);
        setItem('audio.recordings', index);
    };
}

function deleteAudioRecording(recording: AudioRecording) {
    const allRecordings = getItem<Array<{ id: string; title: string }>>('audio.recordings') || [];
    const recordingIndex = allRecordings.findIndex(v => v.title === recording.title);
    if (recordingIndex < 0) {
        throw 'Recording not found';
    }
    const recordingToDelete = allRecordings[recordingIndex];
    allRecordings.splice(recordingIndex, 1);
    setItem('audio.recordings', allRecordings);
    localStorage.removeItem(`audio.recordings.${recordingToDelete.id}`);
}

function getAllAudioRecordings() {
    const allRecordings = getItem<Array<{ id: string; title: string; type: string }>>('audio.recordings') || [];
    return allRecordings.map((recording) => {
        const recordingBlobString = getItem<string>(`audio.recordings.${recording.id}`) || null;
        if (!recordingBlobString) {
            throw 'Recording not found';
        }
        const data = new Uint8Array(recordingBlobString.split(',').map(v => parseInt(v, 10)));
        const blob = new Blob([data], { type: recording.type });
        return { title: recording.title, blob } as AudioRecording;
    });
}

export { type AudioRecording, saveAudioRecording, deleteAudioRecording, getAllAudioRecordings };