import type { AudioRecording } from "../lib/db"
import { getPhotoUrl } from "../lib/globals"
import type { Photo } from "./collageTemplates"

const PHOTOS = `${getPhotoUrl()}/photo`

import { Api, type CollageCellState, type CollageState } from "./Api"
const api = new Api({ baseUrl: getPhotoUrl() });

export async function fetchPhotoList() {
    return (await api.photo.listList()).data;
}

export function asPhotoServiceUrl(photo: Photo | CollageCellState) {
    if (!photo.id) return "";
    return `${PHOTOS}/get?id=${photo.id}`
}

export async function getAllCollages() {
    return (await api.collage.listList()).data;
}

export async function saveCollage(collage: CollageState & { note?: string }) {
    return (await api.collage.saveCreate(collage)).data;
}

export async function getAudioRecording(id: string) {
    return (await api.audio.getAudio({ id })).data;
}

export async function getAllAudioRecordings() {
    return (await api.audio.listList()).data;
}

export async function saveRecording(recording: AudioRecording) {

    return (await api.audio.saveCreate({ audioFile: new File([recording.blob], recording.title) }, { id: recording.id })).data;
}

export async function deleteRecording(recording: AudioRecording) {
    return (await api.audio.deleteList({ id: recording.id })).data;
}