
import { getPhotoUrl } from "../lib/globals"
import type { CollageCellState, Photo } from "./collageTemplates"

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