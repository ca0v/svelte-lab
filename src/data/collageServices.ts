import { getPhotoUrl } from "@/lib/globals";
import { loadAllPhotos, loadAllPhotosByIds, loadMediaItem } from "@googlePhoto/googlePhotoApi"

import type { CollageCellState, CollageData, Photo } from "../d.ts/index"
import { Api } from "@justBeCollage/Api";
import { sleep } from "@/lib/paths";

const baseUrl = await getPhotoUrl();
if (!baseUrl) throw new Error("baseUrl is required");
const api = new Api({ baseUrl });

export function proxy(photoUrl: string) {
    // encode the url twice (see https://github.com/pallets/flask/issues/900)
    photoUrl = encodeURIComponent(photoUrl);
    photoUrl = encodeURIComponent(photoUrl);
    return `${api.baseUrl}/proxy/${photoUrl}`;
}

export async function* fetchPhotoList(startDate: string, endDate: string): AsyncGenerator<Array<Photo>, void, void> {
    await sleep(1000);
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
                created: p.mediaMetadata?.creationTime,
                width: parseInt(p.mediaMetadata?.width || "0"),
                height: parseInt(p.mediaMetadata?.height || "0"),
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
            const data = p.mediaItem!;
            return {
                id: data.id,
                filename: data.filename,
                created: data.mediaMetadata?.creationTime,
                width: parseInt(data.mediaMetadata?.width || "0"),
                height: parseInt(data.mediaMetadata?.height || "0"),
                baseurl: data.baseUrl,
            }
        });
    }
}

export async function asPhotoServiceUrl(photo: CollageCellState) {
    if (!photo.id) throw new Error("photo.id is required");
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
    return (await api.collage.create(collage));
}
