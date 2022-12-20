import type { Photo } from "../d.ts/index";
import { fetchPhotoByIds } from "../data/collageServices";

const transformToUrlMap: Record<string, Photo> = {}

export async function refreshBaseurl(
    photos: Array<{ id?: string; baseurl?: string }>
) {
    // transforms need to have the baseUrl refreshed
    const ids = photos.map((d) => d.id).filter((v) => !!v)
    if (!ids.length) return;

    const iterator = fetchPhotoByIds([...new Set(ids)])

    while (true) {
        const updates = await iterator.next()
        if (updates.done || !updates.value) break;
        updates.value.forEach((p) => (transformToUrlMap[p.id] = p))
    }

    photos.forEach((p) => {
        const original = p.baseurl
        const current = transformToUrlMap[p.id]?.baseurl
        if (!current) return;
        if (original != current) {
            p.baseurl = current;
        }
    })
}

export async function refreshTransforms(transforms: Array<{ id?: string; baseurl?: string }>) {
    return refreshBaseurl(transforms);
}

