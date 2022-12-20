import type { AudioRecording } from "../lib/db"
import { getPhotoUrl } from "../lib/globals"
import { loadAllPhotos, loadAllPhotosByIds, loadMediaItem } from "../lib/googlePhotoApi"

import type { CollageCellState, CollageData, Photo } from "../d.ts/index"
import { Api } from "./Api";
const baseUrl = await getPhotoUrl();
const api = new Api({ baseUrl });

export async function* fetchPhotoList(startDate: string, endDate: string): AsyncGenerator<Array<Photo>, void, void> {
    if (!startDate) throw new Error("startDate is required");
    if (!endDate) throw new Error("endDate is required");
    const startDateMap = startDate.split("-").map((v) => parseInt(v, 10))
    const endDateMap = endDate.split("-").map((v) => parseInt(v, 10))

    const iterator = loadAllPhotos(
        {
            year: startDateMap[0],
            month: startDateMap[1],
            day: startDateMap[2],
        },
        {
            year: endDateMap[0],
            month: endDateMap[1],
            day: endDateMap[2],
        });

    while (true) {
        const photos = (await iterator.next()).value;
        if (!photos) break;

        yield photos.map(p => {
            return {
                id: p.id,
                filename: p.filename,
                created: p.mediaMetadata.creationTime,
                width: parseInt(p.mediaMetadata.width),
                height: parseInt(p.mediaMetadata.height),
                baseurl: p.baseUrl,
            }
        });
    }
}

export async function* fetchPhotoByIds(ids: Array<string>) {
    const photos = loadAllPhotosByIds(ids);
    while (true) {
        const next = await photos.next();
        if (next.done || !next.value) break;
        yield next.value.map(p => {
            return {
                id: p.mediaItem.id,
                filename: p.mediaItem.filename,
                created: p.mediaItem.mediaMetadata.creationTime,
                width: parseInt(p.mediaItem.mediaMetadata.width),
                height: parseInt(p.mediaItem.mediaMetadata.height),
                baseurl: p.mediaItem.baseUrl,
            }
        });
    }
}

export async function asPhotoServiceUrl(photo: CollageCellState) {
    const photoInfo = await loadMediaItem(photo.id);
    return photoInfo.baseUrl;
}

export async function getCollage(id: string) {
    return (await api.collage.get(id));
}

export async function getAllCollages() {
    return (await api.collage.get());
}

export async function saveCollage(collage: CollageData) {
    return (await api.collage.create(collage)).data;
}
