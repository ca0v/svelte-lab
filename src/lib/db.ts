type AudioRecording = {
    id: string;
    title: string
    blob: Blob
}

type AudioRecordings = Record<string, { id: string, title: string, type: string }>;

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

export function blobToArray(blob: Blob) {
    return new Promise<Uint8Array>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const data = new Uint8Array(reader.result as ArrayBuffer);
            resolve(data);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}

async function saveAudioRecording(recording: AudioRecording) {
    // save to local storage
    let { id, title, blob } = recording;
    const recordings = getItem<AudioRecordings>('audio.recordings') || {};

    recordings[id] = { id, title, type: blob.type };

    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = () => {
        // convert data to base64 string
        const data = new Uint8Array(reader.result as ArrayBuffer).join(",");
        setItem(`audio.recordings.${id}`, data);
        setItem('audio.recordings', recordings);
    };
}

function deleteAudioRecording(recording: AudioRecording) {
    const allRecordings = getItem<AudioRecording>('audio.recordings') || {};
    const recordingToDelete = allRecordings[recording.id]
    if (!recordingToDelete) {
        throw `Recording not found: ${recording.id}`;
    }
    delete allRecordings[recording.id]
    setItem('audio.recordings', allRecordings);
    localStorage.removeItem(`audio.recordings.${recordingToDelete.id}`);
}

function getAllAudioRecordings() {
    const allRecordings = getItem<AudioRecordings>('audio.recordings') || {};
    return Object.keys(allRecordings).map((id) => {
        const { title, type } = allRecordings[id];
        const recordingBlobString = getItem<string>(`audio.recordings.${id}`) || null;
        if (!recordingBlobString) {
            throw `Recording not found: ${id}`;
        }
        const data = new Uint8Array(recordingBlobString.split(',').map(v => parseInt(v, 10)));
        const blob = new Blob([data], { type });
        return { id, title, blob } as AudioRecording;
    });
}

export { type AudioRecording, type AudioRecordings, saveAudioRecording, deleteAudioRecording, getAllAudioRecordings };