async function* loadAllPhotos(startDate: gapi.client.photoslibrary.Date, endDate: gapi.client.photoslibrary.Date, pageToken?: string) {
    const offset = new Date().getTimezoneOffset();
    let creationTime = new Date(startDate.year!, startDate.month! - 1, startDate.day!, 6, offset); // 6 am local time
    let endTime = new Date(endDate.year!, endDate.month! - 1, endDate.day!, 6, offset); // 6 am local time
    let i = 0;

    const HOURS = 1000 * 60 * 60

    const result: Array<gapi.client.photoslibrary.MediaItem> = [];
    while (creationTime < endTime && i++ < 25) {
        creationTime = new Date(creationTime.valueOf() + 3 * HOURS); // 1 pic every 3 hrs
        const baseUrl = `https://picsum.photos/id/${7 * startDate.day! + i}/200`
        result.push({
            id: `${i}`,
            baseUrl: baseUrl,
            filename: baseUrl,
            mediaMetadata: {
                creationTime: creationTime.toISOString(),
                height: "300",
                width: "200",
            }
        })
    }
    yield result;
}



async function* loadAllPhotosByIds(ids: Array<string>) {
    for (const id of ids) {
        const result: gapi.client.photoslibrary.MediaItemResult[] = [{
            mediaItem: {
                id,
                baseUrl: `https://picsum.photos/id/${Math.floor(10 + 10 * Math.random())}/300`,
                filename: "test.jpg",
                mediaMetadata: {
                    creationTime: "2021-01-01",
                    height: "300",
                    width: "200",
                }
            }
        }];

        yield result;
    }
}

async function loadMediaItem(mediaItemId: string) {
    const result: gapi.client.photoslibrary.MediaItem = {
        id: mediaItemId,
        baseUrl: "https://picsum.photos/200/300",
        filename: "test.jpg",
        mediaMetadata: {
            creationTime: "2021-01-01",
            height: "300",
            width: "200",
        }
    }
    return result;
}

export { loadAllPhotos, loadAllPhotosByIds, loadMediaItem }
