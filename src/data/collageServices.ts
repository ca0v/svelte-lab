
import type { AudioRecording } from "../lib/db"
import { getPhotoUrl } from "../lib/globals"
import type { CollageCellState, CollageState, Photo } from "./collageTemplates"

const PHOTOS = getPhotoUrl()

export async function fetchPhotoList() {
    const response = await fetch(`${PHOTOS}/list`)
    if (response.ok) {
        const data = (await response.json()) as Array<Photo>
        return data.map((d) => ({
            ...d,
        }))
    }
    throw new Error("Failed to fetch photo list")
}

export function asPhotoServiceUrl(photo: Photo | CollageCellState) {
    if (!photo.id) return "";
    return `${PHOTOS}/get?id=${photo.id}`
}

export async function saveCollage(collage: CollageState & { note?: string }) {
    console.log("saveCollage", collage)
    const response = await fetch(`${PHOTOS}/save?collageId=${collage.id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(collage),
    })
    if (response.ok) {
        const data = (await response.json()) as CollageState
        return data
    }
    throw new Error("Failed to save collage")
}

export async function saveRecording(recording: AudioRecording) {
    const formData = new FormData();
    formData.append("audioFile", recording.blob, "recording.ogg");

    const response = await fetch(`${PHOTOS}/saveRecording`, {
        method: "POST",
        headers: {
            "Accept": "multipart/form-data",
        },
        body: formData,
    })

    if (!response.ok) {
        throw `${response.status}: ${response.statusText}`
    }
}