import type { Photo } from "../d.ts";
import type { AudioRecording } from "../lib/db"
import { getPhotoUrl } from "../lib/globals"

const PHOTOS = `${getPhotoUrl()}/photo`

import { Api, type CollageCellState, type CollageData } from "./Api"
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

export async function saveCollage(collage: CollageData) {
    return (await api.collage.saveCreate(collage, { id: collage.id })).data;
}

export async function getAudioRecording(id: string) {
    return (await api.audio.getAudio({ id })).data;
}

export async function getAllAudioRecordings() {
    return (await api.audio.listList()).data;
}

export async function updateRecording(id: string, changes: Partial<AudioRecording>) {
    return (await api.audio.updateCreate({ ...changes, id })).data;
}

export async function saveRecording(recording: AudioRecording) {

    return (await api.audio.saveCreate({ audioFile: new File([recording.blob], recording.title) }, { id: recording.id })).data;
}

export async function deleteRecording(recording: AudioRecording) {
    return (await api.audio.deleteList({ id: recording.id })).data;
}