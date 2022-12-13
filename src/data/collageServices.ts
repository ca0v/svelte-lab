
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

export async function saveCollage(collage: CollageState) {
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